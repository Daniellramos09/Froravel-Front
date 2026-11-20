import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  apiRequest,
  connectSseStream,
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
  registerFreshPsicologo,
} from './helpers/auth-fixtures.mjs';

describe('Tier 3 — Cross-Feature Combinations (End-to-End Integration)', () => {
  it('T3.C1: R1 Lifecycle — Signup -> confirm email (+ welcome email) -> forgot password -> reset password -> old password fails, new password succeeds', async (t) => {
    if (!hasEmailSink()) {
      t.skip('Email sink unavailable (set E2E_AUTO_START_BACKEND=true, E2E_BACKEND_LOG_FILE, or Mailtrap env)');
      return;
    }

    const oldPass = 'SenhaAntiga@2026';
    const newPass = 'SenhaNova@2026';

    const signupOffset = await markInboxOffset();
    const { email } = await registerFreshMae({ senha: oldPass });
    const confirmCode = await waitForOtpCode({ email, sinceOffset: signupOffset });

    const welcomeOffset = await markInboxOffset();
    const confirmRes = await apiRequest('/api/auth/confirmar-email', {
      method: 'POST',
      body: { email, codigo: confirmCode },
    });
    assert.equal(confirmRes.status, 200);
    assert.equal(confirmRes.json?.verificado, true);

    const welcomeSent = await waitForWelcomeEmail({ email, sinceOffset: welcomeOffset });
    assert.equal(welcomeSent, true, 'Expected post-verification welcome email');

    const forgotOffset = await markInboxOffset();
    const forgotRes = await apiRequest('/api/auth/esqueci-senha', {
      method: 'POST',
      body: { email },
    });
    assert.equal(forgotRes.status, 200);

    const resetCode = await waitForOtpCode({ email, sinceOffset: forgotOffset });
    const resetRes = await apiRequest('/api/auth/redefinir-senha', {
      method: 'POST',
      body: { email, codigo: resetCode, novaSenha: newPass },
    });
    assert.equal(resetRes.status, 200);
    assert.equal(resetRes.json?.redefinida, true);

    const oldLogin = await login(email, oldPass);
    assert.ok([401, 422].includes(oldLogin.status), `Old password should fail login, got ${oldLogin.status}`);

    const newLogin = await login(email, newPass);
    assert.equal(newLogin.status, 200, `New password login failed: ${newLogin.rawText}`);
    assert.equal(newLogin.json?.emailVerificado, true);
    assert.ok(newLogin.json?.tokenSessao);
  });

  it('T3.C2: R2 + Mae Combination — RH invites employee -> Mae activates license -> License list & K-anonymity report update', async () => {
    const rh = await loginSeededRh();
    const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
    assert.equal(empRes.status, 200);
    const empresaId = empRes.json.id;

    const beforeReport = await apiRequest(`/api/rh/empresas/${empresaId}/relatorio-k-anonimato`, {
      token: rh.tokenSessao,
    });
    assert.equal(beforeReport.status, 200);

    const smallDept = `Compliance-${uniqueId('dept')}`;
    const colabEmail = uniqueEmail('colab-ativ');
    const inviteRes = await apiRequest('/api/rh/licencas/convite', {
      method: 'POST',
      token: rh.tokenSessao,
      body: {
        empresaId,
        nomeColaboradora: 'Colaboradora Ativação E2E',
        emailCorporativo: colabEmail,
        departamento: smallDept,
      },
    });
    assert.equal(inviteRes.status, 201);
    const tokenConvite = inviteRes.json.tokenConvite;
    const licencaId = inviteRes.json.id;

    // Register a new Mother and authenticate her to activate the corporate license
    const { email: maeEmail, senha: maeSenha, mae } = await registerFreshMae();
    const maeLogin = await login(maeEmail, maeSenha);
    assert.equal(maeLogin.status, 200);

    const activateRes = await apiRequest('/api/rh/licencas/ativar', {
      method: 'POST',
      token: maeLogin.json.tokenSessao,
      body: { tokenConvite, maeId: mae.id },
    });
    assert.equal(activateRes.status, 200, `Expected 200 on /ativar, got ${activateRes.status}: ${activateRes.rawText}`);
    assert.equal(activateRes.json?.status, 'ATIVADA');

    // RH verifies license list and K-anonymity report reflect activation without exposing <5 dept
    const listRes = await apiRequest(`/api/rh/empresas/${empresaId}/licencas`, { token: rh.tokenSessao });
    assert.equal(listRes.status, 200);
    const found = listRes.json.find((l) => l.id === licencaId);
    assert.ok(found, 'Invited license must appear in GET /licencas');
    assert.equal(found.status, 'ATIVADA');

    const afterReport = await apiRequest(`/api/rh/empresas/${empresaId}/relatorio-k-anonimato`, {
      token: rh.tokenSessao,
    });
    assert.equal(afterReport.status, 200);
    assert.equal(
      afterReport.json.totalLicencasEmitidas,
      beforeReport.json.totalLicencasEmitidas + 1
    );
    assert.equal(
      afterReport.json.totalLicencasAtivadas,
      beforeReport.json.totalLicencasAtivadas + 1
    );
    const eligibleNames = afterReport.json.setoresElegiveis.map((s) => s.nomeSetor);
    assert.ok(!eligibleNames.includes(smallDept), '1-member department must remain masked under K-anonymity');
  });

  it('T3.C3: R4 + Profile Sync — Presigned URL -> PATCH /api/usuarios/me/foto -> GET /me & role profile reflect new photo', async () => {
    // 1. Fresh MAE
    const { email: maeEmail, senha: maeSenha, mae } = await registerFreshMae();
    const maeLogin = await login(maeEmail, maeSenha);
    assert.equal(maeLogin.status, 200);
    const maeToken = maeLogin.json.tokenSessao;

    const maePresign = await apiRequest('/api/usuarios/me/foto/presigned-url', {
      method: 'POST',
      token: maeToken,
      body: { fileName: 'mae-avatar.png', contentType: 'image/png', fileSizeBytes: 98000 },
    });
    assert.equal(maePresign.status, 200);
    const maeFotoUrl = maePresign.json.publicUrl;

    const maePatch = await apiRequest('/api/usuarios/me/foto', {
      method: 'PATCH',
      token: maeToken,
      body: { fotoUrl: maeFotoUrl },
    });
    assert.equal(maePatch.status, 200);

    const maeMe = await apiRequest('/api/usuarios/me', { token: maeToken });
    assert.equal(maeMe.status, 200);
    assert.equal(maeMe.json?.fotoUrl, maeFotoUrl);

    const maeGet = await apiRequest(`/api/maes/${mae.id}`, { token: maeToken });
    assert.equal(maeGet.status, 200);
    assert.equal(maeGet.json?.fotoUrl, maeFotoUrl);

    // 2. Fresh PSICOLOGO (must sync Psicologo.fotoUrl as well as Usuario.fotoUrl)
    const { email: psiEmail, senha: psiSenha, psicologo } = await registerFreshPsicologo();
    const psiLogin = await login(psiEmail, psiSenha);
    assert.equal(psiLogin.status, 200);
    const psiToken = psiLogin.json.tokenSessao;

    const psiPresign = await apiRequest('/api/storage/presigned-url', {
      method: 'POST',
      token: psiToken,
      body: { fileName: 'psi-avatar.webp', contentType: 'image/webp', fileSizeBytes: 145000 },
    });
    assert.equal(psiPresign.status, 200);
    const psiFotoUrl = psiPresign.json.publicUrl;

    const psiPatch = await apiRequest('/api/usuarios/me/foto', {
      method: 'PATCH',
      token: psiToken,
      body: { fotoUrl: psiFotoUrl },
    });
    assert.equal(psiPatch.status, 200);

    const psiMe = await apiRequest('/api/usuarios/me', { token: psiToken });
    assert.equal(psiMe.status, 200);
    assert.equal(psiMe.json?.fotoUrl, psiFotoUrl);

    const psiGet = await apiRequest(`/api/psicologos/${psicologo.id}`, { token: psiToken });
    assert.equal(psiGet.status, 200);
    assert.equal(psiGet.json?.fotoUrl, psiFotoUrl);
  });

  it('T3.C4: R3 Cross-Portal Realtime — Mae & Psicologo SSE streams synchronize join, chat, and leave across portals', async () => {
    const mae = await loginSeededMae();
    const psi = await loginSeededPsi();
    const salaId = uniqueId('cross-portal');

    const maeSse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`, {
      token: mae.tokenSessao,
    });
    const psiSse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`, {
      token: psi.tokenSessao,
    });

    try {
      await maeSse.waitForEvent('CONNECTED');
      await psiSse.waitForEvent('CONNECTED');

      // Psychologist enters room -> Mother stream receives PARTICIPANT_JOINED
      const psiJoin = await apiRequest(`/api/sala-ao-vivo/${salaId}/entrar`, {
        method: 'POST',
        token: psi.tokenSessao,
        body: {
          usuarioId: psi.usuarioId,
          perfilId: psi.perfilId,
          nome: psi.nome,
          role: 'PSICOLOGO',
        },
      });
      assert.equal(psiJoin.status, 200);

      const maeSeesPsi = await maeSse.waitForEvent(
        (e) => e.event === 'PARTICIPANT_JOINED' && JSON.stringify(e.data).includes('PSICOLOGO')
      );
      assert.equal(maeSeesPsi.event, 'PARTICIPANT_JOINED');

      // Mother enters room -> Psychologist stream receives PARTICIPANT_JOINED
      const maeJoin = await apiRequest(`/api/sala-ao-vivo/${salaId}/entrar`, {
        method: 'POST',
        token: mae.tokenSessao,
        body: {
          usuarioId: mae.usuarioId,
          perfilId: mae.perfilId,
          nome: mae.nome,
          role: 'MAE',
        },
      });
      assert.equal(maeJoin.status, 200);

      const psiSeesMae = await psiSse.waitForEvent(
        (e) => e.event === 'PARTICIPANT_JOINED' && JSON.stringify(e.data).includes('MAE')
      );
      assert.equal(psiSeesMae.event, 'PARTICIPANT_JOINED');

      // Mother sends chat -> Psychologist sees CHAT_MESSAGE
      const chatRes = await apiRequest(`/api/sala-ao-vivo/${salaId}/mensagens`, {
        method: 'POST',
        token: mae.tokenSessao,
        body: { remetente: mae.nome, texto: 'Olá Dra., entrei na sala!', isHost: false },
      });
      assert.equal(chatRes.status, 200);
      await psiSse.waitForEvent('CHAT_MESSAGE');

      // Mother leaves -> Psychologist sees PARTICIPANT_LEFT
      const maeLeave = await apiRequest(`/api/sala-ao-vivo/${salaId}/sair`, {
        method: 'POST',
        token: mae.tokenSessao,
        body: {
          usuarioId: mae.usuarioId,
          perfilId: mae.perfilId,
          nome: mae.nome,
          role: 'MAE',
        },
      });
      assert.equal(maeLeave.status, 200);
      await psiSse.waitForEvent('PARTICIPANT_LEFT');
    } finally {
      await maeSse.close();
      await psiSse.close();
    }
  });
});
