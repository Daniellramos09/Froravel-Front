import assert from 'node:assert/strict';
import { SEEDED_MAE, SEEDED_PSI, SEEDED_RH_CANDIDATES } from './config.mjs';
import { apiRequest, generateValidCpf, uniqueEmail, uniqueId } from './http-client.mjs';

export async function login(email, senha) {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, senha },
  });
  return res;
}

export async function loginSeededMae() {
  const res = await login(SEEDED_MAE.email, SEEDED_MAE.senha);
  assert.equal(res.status, 200, `Seeded MAE login failed (${res.status}): ${res.rawText}`);
  assert.ok(res.json?.tokenSessao, 'Seeded MAE login missing tokenSessao');
  return res.json;
}

export async function loginSeededPsi() {
  const res = await login(SEEDED_PSI.email, SEEDED_PSI.senha);
  assert.equal(res.status, 200, `Seeded PSICOLOGO login failed (${res.status}): ${res.rawText}`);
  assert.ok(res.json?.tokenSessao, 'Seeded PSICOLOGO login missing tokenSessao');
  return res.json;
}

export async function loginSeededRh() {
  const attempts = [];
  for (const candidate of SEEDED_RH_CANDIDATES) {
    const res = await login(candidate.email, candidate.senha);
    if (res.status === 200 && res.json?.tokenSessao && res.json?.tipoPerfil === 'RH') {
      return res.json;
    }
    attempts.push(`${candidate.email} -> ${res.status}`);
  }
  throw new Error(
    `Unable to authenticate seeded RH user. Tried: [${attempts.join(', ')}]. ` +
      'Ensure DemoDayDataSeeder seeds a TipoPerfil.RH user or set E2E_RH_EMAIL / E2E_RH_PASSWORD.'
  );
}

export async function registerFreshMae(overrides = {}) {
  const email = overrides.email || uniqueEmail('mae');
  const senha = overrides.senha || 'Floravel@2026';
  const payload = {
    nome: overrides.nome || `Mae Teste ${uniqueId('nome')}`,
    email,
    senha,
    telefone: '(11) 98888-7777',
    cidade: 'São Paulo',
    estado: 'SP',
    dataNascimento: '1995-04-12',
    cpf: generateValidCpf(),
    ...overrides,
  };
  const res = await apiRequest('/api/maes', {
    method: 'POST',
    body: payload,
  });
  assert.equal(res.status, 201, `Expected 201 on POST /api/maes, got ${res.status}: ${res.rawText}`);
  return { payload, mae: res.json, email, senha };
}

export async function registerFreshPsicologo(overrides = {}) {
  const email = overrides.email || uniqueEmail('psi');
  const senha = overrides.senha || 'Floravel@2026';
  const payload = {
    nome: overrides.nome || `Dra. Teste ${uniqueId('psi')}`,
    email,
    senha,
    crp: `06/${Math.floor(100000 + Math.random() * 899999)}`,
    telefone: '(11) 97777-6666',
    cidade: 'São Paulo',
    estado: 'SP',
    especialidade: 'Psicologia Perinatal',
    abordagem: 'Escuta Perinatal',
    valorConsulta: 100.0,
    ...overrides,
  };
  const res = await apiRequest('/api/psicologos', {
    method: 'POST',
    body: payload,
  });
  assert.equal(res.status, 201, `Expected 201 on POST /api/psicologos, got ${res.status}: ${res.rawText}`);
  return { payload, psicologo: res.json, email, senha };
}
