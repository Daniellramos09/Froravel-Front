import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const E2E_DIR = path.resolve(__dirname, '..');
export const FRONTEND_ROOT = path.resolve(E2E_DIR, '..', '..');
export const BACKEND_ROOT = process.env.E2E_BACKEND_DIR
  ? path.resolve(process.env.E2E_BACKEND_DIR)
  : path.resolve(FRONTEND_ROOT, '..', 'floravel-backend', 'Floravel');

export const API_BASE = (process.env.E2E_API_BASE || 'http://localhost:8080').replace(/\/+$/, '');
export const DEFAULT_TIMEOUT_MS = Number(process.env.E2E_TIMEOUT_MS || 10000);
export const SSE_TIMEOUT_MS = Number(process.env.E2E_SSE_TIMEOUT_MS || 7000);

export const SEEDED_MAE = {
  email: process.env.E2E_MAE_EMAIL || 'mariana.silva@email.com',
  senha: process.env.E2E_MAE_PASSWORD || 'floravel123',
};

export const SEEDED_PSI = {
  email: process.env.E2E_PSI_EMAIL || 'helena.souza@floravel.com.br',
  senha: process.env.E2E_PSI_PASSWORD || 'floravel123',
};

export const SEEDED_RH_CANDIDATES = [
  ...(process.env.E2E_RH_EMAIL
    ? [{ email: process.env.E2E_RH_EMAIL, senha: process.env.E2E_RH_PASSWORD || 'floravel123' }]
    : []),
  { email: 'rh@techmaes.com.br', senha: process.env.E2E_RH_PASSWORD || 'floravel123' },
  { email: 'rh@floravel.com.br', senha: process.env.E2E_RH_PASSWORD || 'floravel123' },
  { email: 'gestao.rh@techmaes.com.br', senha: process.env.E2E_RH_PASSWORD || 'floravel123' },
];
