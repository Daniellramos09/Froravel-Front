import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';

const outDir = 'C:\\Users\\danie\\.gemini\\antigravity\\brain\\c166ce14-4ede-433f-9795-4b8d03aec60d';
const url = 'http://localhost:5175/';

function findChrome() {
  const local = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe') : null;
  const c = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', local, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'];
  return c.find(p => p && fs.existsSync(p));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = path.join(os.tmpdir(), 'floravel-app-verify-' + process.pid);
fs.mkdirSync(profile, { recursive: true });
const portFile = path.join(profile, 'DevToolsActivePort');

const child = spawn(findChrome(), ['--headless=new', `--user-data-dir=${profile}`, '--remote-debugging-port=0', '--no-first-run', '--disable-gpu', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore', windowsHide: true });
const kill = () => { try { execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {} };

try {
  let dbgPort = null;
  for (let i = 0; i < 100 && !dbgPort; i++) { await sleep(100); try { dbgPort = parseInt(fs.readFileSync(portFile, 'utf8'), 10) || null; } catch {} }
  const ver = await (await fetch(`http://127.0.0.1:${dbgPort}/json/version`)).json();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', j, { once: true }); });
  let id = 0; const pend = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
  const send = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  const { result: { targetId } } = await send('Target.createTarget', { url });
  const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
  const S = async (m, p) => (await send(m, p, sessionId)).result;
  const ev = async x => (await S('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }))?.result?.value;

  await S('Page.enable'); await S('Runtime.enable');
  await S('Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(1500);

  const shot = async (name) => {
    await sleep(600);
    const { data } = await S('Page.captureScreenshot', { format: 'png' });
    const p = path.join(outDir, name);
    fs.writeFileSync(p, Buffer.from(data, 'base64'));
    console.log('saved', p);
  };

  // 1. Dashboard inicial com foto da persona e botões de acessibilidade
  await shot('verify_app_dashboard_persona.png');

  // 2. Clique no Ouvir Tela para ativar narração e exibir a barra de legenda
  await ev(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ouvir Tela'));
    if (btn) btn.click();
  `);
  await sleep(1000);
  await shot('verify_app_ouvir_tela_legenda.png');

  // 3. Navegação para Rede de Apoio para validar a tipografia padronizada
  await ev(`
    const navItem = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Rede de Apoio'));
    if (navItem) navItem.click();
  `);
  await sleep(1000);
  await shot('verify_app_rede_apoio_tipografia.png');

  // 4. Abertura do Modal de Indicar Mãe
  await ev(`
    const badge = document.querySelector('[aria-label="Florável solidário"]');
    if (badge) {
      badge.click();
    }
  `);
  await sleep(500);
  await ev(`
    const btnIndicar = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Indicar'));
    if (btnIndicar) btnIndicar.click();
  `);
  await sleep(800);
  await shot('verify_app_modal_indicar_mae.png');

} finally {
  kill();
}
