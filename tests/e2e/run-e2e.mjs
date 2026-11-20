import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { API_BASE, BACKEND_ROOT, E2E_DIR } from './helpers/config.mjs';

const TIER_FILES = {
  1: path.join(E2E_DIR, 'tier1-features.e2e.mjs'),
  2: path.join(E2E_DIR, 'tier2-boundaries.e2e.mjs'),
  3: path.join(E2E_DIR, 'tier3-combinations.e2e.mjs'),
  4: path.join(E2E_DIR, 'tier4-scenarios.e2e.mjs'),
};

function printHelp() {
  console.log(`
Florável Platform — Opaque-Box E2E Test Runner (Tiers 1–4)

Usage:
  node tests/e2e/run-e2e.mjs [options]

Options:
  --tier=1,2,3,4      Comma-separated tiers to run (default: 1,2,3,4)
  --filter=<pattern>  Optional test name regex/pattern filter
  --dry-run           Validate test files & runner configuration without hitting server
  --skip-builds       Skip Tier 4 npm run build:all check (sets E2E_SKIP_BUILDS=true)
  --help, -h          Show this help message

Environment Variables:
  E2E_API_BASE                Target Spring Boot API URL (default: http://localhost:8080)
  E2E_AUTO_START_BACKEND      Set "true" to spawn mvnw spring-boot:run & capture email logs
  E2E_BACKEND_DIR             Override backend repo directory
  E2E_BACKEND_LOG_FILE        Path to backend stdout/log file for OTP extraction
  E2E_MAILTRAP_API_TOKEN      Optional Mailtrap API token for OTP inbox extraction
  E2E_MAILTRAP_INBOX_ID       Optional Mailtrap inbox ID
  E2E_MAE_EMAIL / PASSWORD    Seeded MAE credentials (default: mariana.silva@email.com)
  E2E_PSI_EMAIL / PASSWORD    Seeded PSICOLOGO credentials (default: helena.souza@floravel.com.br)
  E2E_RH_EMAIL / PASSWORD     Seeded RH credentials
  E2E_SKIP_BUILDS             Set "true" to skip frontend build gate in Tier 4
`);
}

function parseArgs(argv) {
  const opts = {
    tiers: [1, 2, 3, 4],
    filter: '',
    dryRun: false,
    skipBuilds: process.env.E2E_SKIP_BUILDS === 'true',
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--skip-builds') {
      opts.skipBuilds = true;
    } else if (arg.startsWith('--filter=')) {
      opts.filter = arg.slice('--filter='.length);
    } else if (arg.startsWith('--tier=')) {
      const raw = arg.slice('--tier='.length).split(',').map((s) => Number(s.trim()));
      const valid = raw.filter((n) => [1, 2, 3, 4].includes(n));
      if (valid.length === 0) {
        throw new Error(`Invalid --tier value: ${arg}. Allowed: 1, 2, 3, 4`);
      }
      opts.tiers = valid;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return opts;
}

async function checkHealth(timeoutMs = 2500) {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(timeoutMs) });
    return res.ok;
  } catch {
    return false;
  }
}

async function startManagedBackend() {
  const logFile = path.join(os.tmpdir(), `floravel-e2e-backend-${Date.now()}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'cmd.exe' : './mvnw';
  const args = isWin ? ['/c', 'mvnw.cmd', 'spring-boot:run'] : ['spring-boot:run'];

  console.log(`[e2e-runner] Auto-starting Spring Boot backend in ${BACKEND_ROOT}`);
  console.log(`[e2e-runner] Capturing backend logs (email fallback sink) -> ${logFile}`);

  const child = spawn(cmd, args, {
    cwd: BACKEND_ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);

  const deadline = Date.now() + 90_000;
  let exited = false;
  child.once('exit', (code) => {
    exited = true;
    console.error(`[e2e-runner] Managed backend exited early with code ${code}. Check ${logFile}`);
  });

  while (Date.now() < deadline) {
    if (exited) {
      throw new Error(`Backend failed to start. Inspect log: ${logFile}`);
    }
    if (await checkHealth(2000)) {
      process.env.E2E_BACKEND_LOG_FILE = logFile;
      console.log(`[e2e-runner] Backend healthy at ${API_BASE}/api/health`);
      return {
        logFile,
        stop: async () => {
          if (isWin && child.pid) {
            spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
          } else {
            child.kill('SIGTERM');
          }
          logStream.end();
        },
      };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  if (isWin && child.pid) {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    child.kill('SIGKILL');
  }
  logStream.end();
  throw new Error(`Timed out waiting 90s for backend health at ${API_BASE}/api/health. Log: ${logFile}`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  if (opts.skipBuilds) {
    process.env.E2E_SKIP_BUILDS = 'true';
  }

  const selectedFiles = opts.tiers.map((t) => TIER_FILES[t]);

  if (opts.dryRun) {
    console.log('[e2e-runner] Dry-run verification:');
    console.log(`  API Base:      ${API_BASE}`);
    console.log(`  Backend Dir:   ${BACKEND_ROOT}`);
    console.log(`  Selected Tiers:${opts.tiers.join(', ')}`);
    for (const file of selectedFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Missing test file: ${file}`);
      }
      const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf-8' });
      if (check.status !== 0) {
        throw new Error(`Syntax check failed for ${file}: ${check.stderr}`);
      }
      console.log(`  [OK] ${path.relative(E2E_DIR, file)}`);
    }
    console.log('[e2e-runner] Dry-run passed.');
    process.exit(0);
  }

  let managedBackend = null;
  const autoStart = process.env.E2E_AUTO_START_BACKEND === 'true';

  try {
    const alreadyUp = await checkHealth();
    if (!alreadyUp) {
      if (autoStart) {
        managedBackend = await startManagedBackend();
      } else {
        console.error(
          `[e2e-runner] ERROR: Backend is not reachable at ${API_BASE}/api/health.\n` +
            `Start the Spring Boot server or set E2E_AUTO_START_BACKEND=true.`
        );
        process.exit(2);
      }
    } else {
      console.log(`[e2e-runner] Connected to running backend at ${API_BASE}`);
    }

    const summary = { passed: 0, failed: 0, skipped: 0, cancelled: 0, total: 0, success: true };

    const stream = run({
      files: selectedFiles,
      concurrency: false,
      timeout: 240_000,
      ...(opts.filter ? { testNamePattern: opts.filter } : {}),
    });

    stream.on('test:summary', (evt) => {
      if (evt?.counts && evt.file === undefined) {
        summary.total = evt.counts.tests ?? 0;
        summary.passed = evt.counts.passed ?? 0;
        summary.failed = evt.counts.failed ?? 0;
        summary.skipped = evt.counts.skipped ?? 0;
        summary.cancelled = evt.counts.cancelled ?? 0;
        summary.success = Boolean(evt.success);
      }
    });

    stream.compose(spec).pipe(process.stdout);

    await new Promise((resolve) => {
      stream.on('end', resolve);
      stream.on('close', resolve);
    });

    console.log('\n============================================================');
    console.log('Florável E2E Suite Summary');
    console.log(`  Tiers:     ${opts.tiers.join(', ')}`);
    console.log(`  Total:     ${summary.total}`);
    console.log(`  Passed:    ${summary.passed}`);
    console.log(`  Skipped:   ${summary.skipped}`);
    console.log(`  Failed:    ${summary.failed}`);
    console.log(`  Cancelled: ${summary.cancelled}`);
    console.log('============================================================');

    process.exitCode = summary.failed > 0 || summary.cancelled > 0 || !summary.success ? 1 : 0;
  } finally {
    if (managedBackend) {
      await managedBackend.stop();
    }
  }
}

main().catch((err) => {
  console.error(`[e2e-runner] Fatal error: ${err?.stack || err}`);
  process.exit(1);
});
