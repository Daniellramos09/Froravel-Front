import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

function getLogFilePath() {
  return process.env.E2E_BACKEND_LOG_FILE || '';
}

function getMailtrapConfig() {
  const token = process.env.E2E_MAILTRAP_API_TOKEN || '';
  const inboxId = process.env.E2E_MAILTRAP_INBOX_ID || '';
  return token && inboxId ? { token, inboxId } : null;
}

export function hasEmailSink() {
  const logFile = getLogFilePath();
  if (logFile && existsSync(logFile)) return true;
  if (getMailtrapConfig()) return true;
  return false;
}

export async function markInboxOffset() {
  const logFile = getLogFilePath();
  if (logFile && existsSync(logFile)) {
    const stat = await fs.stat(logFile);
    return { byteOffset: stat.size, timestampMs: Date.now() };
  }
  return { byteOffset: 0, timestampMs: Date.now() };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractCodeFromLogSlice(slice, email) {
  const normalized = email.trim().toLowerCase();
  const lines = slice.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const lineLower = lines[i].toLowerCase();
    if (!lineLower.includes(normalized)) continue;

    // Single-line pattern e.g.: "Disparando código de verificação para <email>: [123456]"
    const inlineMatch = lines[i].match(/\[(\d{6})\]|\[\s*(\d{6})\s*\]/);
    if (inlineMatch) {
      return inlineMatch[1] || inlineMatch[2];
    }

    // Multi-line fallback block e.g.:
    // Destinatário: foo@bar.com
    // Código de Confirmação / Recuperação: [ 123456 ]
    const windowText = lines.slice(i, Math.min(lines.length, i + 6)).join('\n');
    const blockMatch = windowText.match(/(?:c[óo]digo[^:\n]*:\s*\[?\s*|code[^:\n]*:\s*\[?\s*)(\d{6})/i);
    if (blockMatch) {
      return blockMatch[1];
    }
  }
  return null;
}

function hasWelcomeFromLogSlice(slice, email) {
  const normalized = email.trim().toLowerCase();
  const lines = slice.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const lineLower = lines[i].toLowerCase();
    if (!lineLower.includes(normalized)) continue;
    const windowText = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 6)).join('\n').toLowerCase();
    if (
      windowText.includes('boas-vindas') ||
      windowText.includes('boas vindas') ||
      windowText.includes('bem-vinda') ||
      windowText.includes('welcome')
    ) {
      return true;
    }
  }
  return false;
}

async function readLogSlice(byteOffset = 0) {
  const logFile = getLogFilePath();
  if (!logFile || !existsSync(logFile)) return '';
  const buf = await fs.readFile(logFile);
  const start = Math.min(byteOffset, buf.length);
  return buf.subarray(start).toString('utf-8');
}

async function fetchMailtrapOtp(email, timestampMs) {
  const cfg = getMailtrapConfig();
  if (!cfg) return null;
  const res = await fetch(`https://mailtrap.io/api/v1/inboxes/${cfg.inboxId}/messages`, {
    headers: { 'Api-Token': cfg.token },
  });
  if (!res.ok) return null;
  const messages = await res.json();
  const target = email.trim().toLowerCase();
  for (const msg of messages) {
    const createdMs = Date.parse(msg.created_at || '') || 0;
    if (createdMs && createdMs + 5000 < timestampMs) continue;
    if (String(msg.to_email || '').toLowerCase().includes(target)) {
      const bodyRes = await fetch(`https://mailtrap.io/api/v1/inboxes/${cfg.inboxId}/messages/${msg.id}/body.html`, {
        headers: { 'Api-Token': cfg.token },
      });
      if (!bodyRes.ok) continue;
      const html = await bodyRes.text();
      const match = html.match(new RegExp(`\\b(\\d{6})\\b`)) || (msg.subject || '').match(/\b(\d{6})\b/);
      if (match) return match[1];
    }
  }
  return null;
}

async function fetchMailtrapWelcome(email, timestampMs) {
  const cfg = getMailtrapConfig();
  if (!cfg) return false;
  const res = await fetch(`https://mailtrap.io/api/v1/inboxes/${cfg.inboxId}/messages`, {
    headers: { 'Api-Token': cfg.token },
  });
  if (!res.ok) return false;
  const messages = await res.json();
  const target = email.trim().toLowerCase();
  return messages.some((msg) => {
    const createdMs = Date.parse(msg.created_at || '') || 0;
    if (createdMs && createdMs + 5000 < timestampMs) return false;
    const toMatch = String(msg.to_email || '').toLowerCase().includes(target);
    const subj = String(msg.subject || '').toLowerCase();
    return toMatch && (subj.includes('boas-vindas') || subj.includes('bem-vinda') || subj.includes('welcome'));
  });
}

export async function waitForOtpCode({ email, sinceOffset = { byteOffset: 0, timestampMs: 0 }, timeoutMs = 8000 }) {
  const deadline = Date.now() + timeoutMs;
  const escaped = escapeRegExp(email);
  void escaped;

  while (Date.now() < deadline) {
    const slice = await readLogSlice(sinceOffset.byteOffset || 0);
    if (slice) {
      const code = extractCodeFromLogSlice(slice, email);
      if (code) return code;
    }
    const mtCode = await fetchMailtrapOtp(email, sinceOffset.timestampMs || 0);
    if (mtCode) return mtCode;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out after ${timeoutMs}ms waiting for 6-digit OTP email for ${email}`);
}

export async function waitForWelcomeEmail({ email, sinceOffset = { byteOffset: 0, timestampMs: 0 }, timeoutMs = 8000 }) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const slice = await readLogSlice(sinceOffset.byteOffset || 0);
    if (slice && hasWelcomeFromLogSlice(slice, email)) {
      return true;
    }
    if (await fetchMailtrapWelcome(email, sinceOffset.timestampMs || 0)) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}
