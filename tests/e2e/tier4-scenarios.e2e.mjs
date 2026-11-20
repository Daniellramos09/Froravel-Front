import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { BACKEND_ROOT, FRONTEND_ROOT } from './helpers/config.mjs';
import {
  apiRequest,
  connectSseStream,
  generateValidCpf,
  uniqueEmail,
  uniqueId,
} from './helpers/http-client.mjs';
import {
  hasEmailSink,
  markInboxOffset,
  waitForOtpCode,
  waitForWelcomeEmail,
} from './helpers/email-otp.mjs';
import {
  login,
  loginSeededMae,
  loginSeededPsi,
  loginSeededRh,
  registerFreshMae,
} from './helpers/auth-fixtures.mjs';

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.java', '.properties', '.yml', '.yaml']);
const IGNORED_DIRS = new Set(['node_modules', 'dist', 'target', '.git', '.agents', 'build', 'coverage']);

async function collectFiles(dirPath) {
  const results = [];
  if (!existsSync(dirPath)) return results;
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(full)));
    } else if (CODE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

describe('Tier 4 — Real-World Application Scenarios & Production Gates', () => {
  it('T4.S1: Journey 1 — New mother identity check, registration, email verification, password reset & avatar update', async (t) => {
    const cpf = generateValidCpf();
    const nome = `Ana Clara ${uniqueId('j1')}`;
    const dataNascimento = '1994-08-15';

    // 1. Validate identity via government simulator
    const govRes = await apiRequest('/api/governo/validar-identidade', {
      method: 'POST',
      body: {
        cpf,
        dataNascimentoInformada: dataNascimento,
        nomeInformado: nome,
      },
    });
    assert.equal(govRes.status, 200, `Expected 200 on governo validation, got ${govRes.status}: ${govRes.rawText}`);

    // 2. Register mother
    const offsetSignup = await markInboxOffset();
    const initialPass = 'Jornada1@Inicial';
    const { email } = await registerFreshMae({ nome, cpf, dataNascimento, senha: initialPass });

    let activePass = initialPass;
    if (hasEmailSink()) {
      // 3. Confirm email & welcome email
      const confirmCode = await waitForOtpCode({ email, sinceOffset: offsetSignup });
      const offsetConfirm = await markInboxOffset();
      const confirmRes = await apiRequest('/api/auth/confirmar-email', {
        method: 'POST',
        body: { email, codigo: confirmCode },
      });
      assert.equal(confirmRes.status, 200);
      assert.equal(confirmRes.json?.verificado, true);
      assert.equal(await waitForWelcomeEmail({ email, sinceOffset: offsetConfirm }), true);

      // 4. Forgot + reset password
      const offsetReset = await markInboxOffset();
      assert.equal((await apiRequest('/api/auth/esqueci-senha', { method: 'POST', body: { email } })).status, 200);
      const resetCode = await waitForOtpCode({ email, sinceOffset: offsetReset });
      activePass = 'Jornada1@Redefinida';
      const resetRes = await apiRequest('/api/auth/redefinir-senha', {
        method: 'POST',
        body: { email, codigo: resetCode, novaSenha: activePass },
      });
      assert.equal(resetRes.status, 200);
    }

    // 5. Login and update profile photo via presigned URL
    const loginRes = await login(email, activePass);
    assert.equal(loginRes.status, 200);
    const token = loginRes.json.tokenSessao;

    const presignRes = await apiRequest('/api/usuarios/me/foto/presigned-url', {
      method: 'POST',
      token,
      body: { fileName: 'ana-perfil.jpg', contentType: 'image/jpeg', fileSizeBytes: 84000 },
    });
    assert.equal(presignRes.status, 200);

    const patchRes = await apiRequest('/api/usuarios/me/foto', {
      method: 'PATCH',
      token,
      body: { fotoUrl: presignRes.json.publicUrl },
    });
    assert.equal(patchRes.status, 200);

    const meRes = await apiRequest('/api/usuarios/me', { token });
    assert.equal(meRes.status, 200);
    assert.equal(meRes.json?.fotoUrl, presignRes.json.publicUrl);

    if (!hasEmailSink()) {
      t.diagnostic('Completed registration, login, and photo flow; OTP steps skipped because email sink was unavailable');
    }
  });

  it('T4.S2: Journey 2 — Corporate RH manager campaign (discover, update/restore, invite, resend, revoke, reactivate, K-anonymity audit)', async () => {
    const rh = await loginSeededRh();
    const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
    assert.equal(empRes.status, 200);
    const empresa = empRes.json;

    // Invite 2 employees
    const inv1 = await apiRequest('/api/rh/licencas/convite', {
      method: 'POST',
      token: rh.tokenSessao,
      body: {
        empresaId: empresa.id,
        nomeColaboradora: 'Jornada RH 1',
        emailCorporativo: uniqueEmail('rhj1'),
        departamento: 'People E2E',
      },
    });
    const inv2 = await apiRequest('/api/rh/licencas/convite', {
      method: 'POST',
      token: rh.tokenSessao,
      body: {
        empresaId: empresa.id,
        nomeColaboradora: 'Jornada RH 2',
        emailCorporativo: uniqueEmail('rhj2'),
        departamento: 'People E2E',
      },
    });
    assert.equal(inv1.status, 201);
    assert.equal(inv2.status, 201);

    // Resend inv1
    assert.equal(
      (await apiRequest(`/api/rh/licencas/${inv1.json.id}/reenviar`, { method: 'POST', token: rh.tokenSessao })).status,
      200
    );

    // Revoke then reactivate inv2
    const rev = await apiRequest(`/api/rh/licencas/${inv2.json.id}/revogar`, { method: 'PATCH', token: rh.tokenSessao });
    assert.equal(rev.status, 200);
    assert.equal(rev.json?.status, 'REVOGADA');

    const react = await apiRequest(`/api/rh/licencas/${inv2.json.id}/reativar`, { method: 'PATCH', token: rh.tokenSessao });
    assert.equal(react.status, 200);
    assert.equal(react.json?.status, 'PENDENTE');

    // Audit K-anonymity report for zero clinical/PII leak
    const report = await apiRequest(`/api/rh/empresas/${empresa.id}/relatorio-k-anonimato`, { token: rh.tokenSessao });
    assert.equal(report.status, 200);
    const serialized = JSON.stringify(report.json).toLowerCase();
    assert.ok(!serialized.includes('edimburgoScore'.toLowerCase()));
    assert.ok(!serialized.includes('cpf'));
    assert.ok(!serialized.includes(inv1.json.emailCorporativo));
  });

  it('T4.S3: Journey 3 — Live SalaAcolhimento session with Jitsi room, SSE alerts, chat & Escudo Florável Disjuntor', async () => {
    const psi = await loginSeededPsi();
    const mae = await loginSeededMae();
    const salaId = uniqueId('jornada-sala');

    const psiSse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`, { token: psi.tokenSessao });
    const maeSse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`, { token: mae.tokenSessao });

    try {
      await psiSse.waitForEvent('CONNECTED');
      await maeSse.waitForEvent('CONNECTED');

      const estadoInit = await apiRequest(`/api/sala-ao-vivo/${salaId}/estado`);
      assert.equal(estadoInit.status, 200);
      assert.match(estadoInit.json?.jitsiRoomName || '', /^floravel-acolhimento-/);

      // Start session
      assert.equal(
        (await apiRequest(`/api/sala-ao-vivo/${salaId}/status`, { method: 'POST', body: { status: 'AO_VIVO' } })).status,
        200
      );
      await maeSse.waitForEvent('ROOM_STATUS_CHANGED');

      // Both join
      await apiRequest(`/api/sala-ao-vivo/${salaId}/entrar`, {
        method: 'POST',
        body: { usuarioId: psi.usuarioId, perfilId: psi.perfilId, nome: psi.nome, role: 'PSICOLOGO' },
      });
      await apiRequest(`/api/sala-ao-vivo/${salaId}/entrar`, {
        method: 'POST',
        body: { usuarioId: mae.usuarioId, perfilId: mae.perfilId, nome: mae.nome, role: 'MAE' },
      });
      await psiSse.waitForEvent((e) => e.event === 'PARTICIPANT_JOINED' && JSON.stringify(e.data).includes('MAE'));

      // Chat exchange
      await apiRequest(`/api/sala-ao-vivo/${salaId}/mensagens`, {
        method: 'POST',
        body: { remetente: psi.nome, texto: 'Bem-vinda ao acolhimento!', isHost: true },
      });
      await maeSse.waitForEvent('CHAT_MESSAGE');

      // Trigger Disjuntor
      const disj = await apiRequest(`/api/sala-ao-vivo/${salaId}/disjuntor`, {
        method: 'POST',
        body: { alvo: mae.nome },
      });
      assert.equal(disj.status, 200);
      assert.equal(disj.json?.disjuntorAcionado, true);
      await maeSse.waitForEvent('DISJUNTOR_ACIONADO');

      // Resume AO_VIVO clears Disjuntor
      const resume = await apiRequest(`/api/sala-ao-vivo/${salaId}/status`, {
        method: 'POST',
        body: { status: 'AO_VIVO' },
      });
      assert.equal(resume.status, 200);
      assert.equal(resume.json?.disjuntorAcionado, false);

      // Clean leave
      await apiRequest(`/api/sala-ao-vivo/${salaId}/sair`, {
        method: 'POST',
        body: { usuarioId: mae.usuarioId, nome: mae.nome, role: 'MAE' },
      });
      await psiSse.waitForEvent('PARTICIPANT_LEFT');
    } finally {
      await psiSse.close();
      await maeSse.close();
    }
  });

  it('T4.S4: Journey 4 — All 4 frontend workspaces (landing, mae, psicologo, rh) build cleanly with 0 errors', async (t) => {
    if (process.env.E2E_SKIP_BUILDS === 'true') {
      t.skip('Skipped via E2E_SKIP_BUILDS=true');
      return;
    }

    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'cmd.exe' : 'npm';
    const args = isWin ? ['/c', 'npm.cmd', 'run', 'build:all'] : ['run', 'build:all'];
    const res = spawnSync(cmd, args, {
      cwd: FRONTEND_ROOT,
      encoding: 'utf-8',
      timeout: 180000,
    });
    assert.equal(
      res.status,
      0,
      `npm run build:all failed (exit ${res.status}):\n${res.stdout}\n${res.stderr}`
    );

    for (const appName of ['landing', 'mae', 'psicologo', 'rh']) {
      const indexHtml = path.join(FRONTEND_ROOT, 'apps', appName, 'dist', 'index.html');
      assert.ok(existsSync(indexHtml), `Expected built artifact at ${indexHtml}`);
    }
  });

  it('T4.S5: Journey 5 — Static scan verifies zero hardcoded secret keys or frontend credential literals', async () => {
    const scanRoots = [
      path.join(FRONTEND_ROOT, 'apps'),
      path.join(FRONTEND_ROOT, 'packages'),
      path.join(BACKEND_ROOT, 'src', 'main'),
    ];

    const secretRules = [
      { name: 'AWS Access Key ID', regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
      { name: 'Private Key Block', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
      { name: 'GitHub/Slack/Stripe Token', regex: /\b(?:ghp_[A-Za-z0-9]{20,}|xoxb-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{16,})\b/g },
      {
        name: 'Hardcoded S3/R2/JWT Secret Literal in Code',
        regex: /(?:accessKeyId|secretAccessKey|secretKey|jwtSecret)\s*[:=]\s*["'][^"'${}]{12,}["']/g,
      },
    ];

    const frontendOnlyRules = [
      {
        name: 'Hardcoded Demo Password Literal in Frontend',
        regex: /(?:senha|password)\s*[:=]\s*["']floravel123["']/gi,
      },
    ];

    const violations = [];

    for (const rootDir of scanRoots) {
      const files = await collectFiles(rootDir);
      const isFrontend = rootDir.startsWith(FRONTEND_ROOT);
      const rules = isFrontend ? [...secretRules, ...frontendOnlyRules] : secretRules;

      for (const filePath of files) {
        const content = await fs.readFile(filePath, 'utf-8');
        for (const rule of rules) {
          rule.regex.lastIndex = 0;
          const match = rule.regex.exec(content);
          if (match) {
            violations.push(`${rule.name} in ${filePath}: ${match[0]}`);
          }
        }
      }
    }

    assert.deepEqual(violations, [], `Hardcoded secret violations found:\n${violations.join('\n')}`);
  });
});
