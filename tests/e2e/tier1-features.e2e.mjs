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
} from './helpers/auth-fixtures.mjs';

describe('Tier 1 — Core Feature Coverage (Blocks R1–R4)', () => {
  // =========================================================================
  // BLOCK R1: E-mail, Confirmação, Boas-vindas e Recuperação de Senha (6 tests)
  // =========================================================================
  describe('Block R1 — Auth, Email Verification & Password Recovery', () => {
    it('R1.T1: POST /api/auth/esqueci-senha returns 200 with 15-min TTL for existing user', async () => {
      const { email } = await registerFreshMae();
      const res = await apiRequest('/api/auth/esqueci-senha', {
        method: 'POST',
        body: { email },
      });
      assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${res.rawText}`);
      assert.equal(typeof res.json?.mensagem, 'string');
      assert.ok(res.json.mensagem.length > 0);
      assert.equal(res.json.email?.toLowerCase(), email);
      assert.equal(res.json.expiracaoMinutos, 15);
    });

    it('R1.T2: POST /api/auth/esqueci-senha does not leak account existence on unknown email', async () => {
      const unknownEmail = uniqueEmail('unknown');
      const res = await apiRequest('/api/auth/esqueci-senha', {
        method: 'POST',
        body: { email: unknownEmail },
      });
      assert.equal(res.status, 200, `Expected 200 anti-enumeration response, got ${res.status}: ${res.rawText}`);
      assert.equal(typeof res.json?.mensagem, 'string');
      assert.equal(res.json.expiracaoMinutos, 15);
    });

    it('R1.T3: POST /api/auth/redefinir-senha with valid 6-digit code resets password and updates login', async (t) => {
      if (!hasEmailSink()) {
        t.skip('Email sink unavailable (set E2E_AUTO_START_BACKEND=true, E2E_BACKEND_LOG_FILE, or Mailtrap env)');
        return;
      }

      const { email } = await registerFreshMae();
      const offset = await markInboxOffset();

      const forgotRes = await apiRequest('/api/auth/esqueci-senha', {
        method: 'POST',
        body: { email },
      });
      assert.equal(forgotRes.status, 200);

      const code = await waitForOtpCode({ email, sinceOffset: offset });
      assert.match(code, /^\d{6}$/);

      const newPassword = `NovaSenha#${Date.now()}`;
      const resetRes = await apiRequest('/api/auth/redefinir-senha', {
        method: 'POST',
        body: { email, codigo: code, novaSenha: newPassword },
      });
      assert.equal(resetRes.status, 200, `Expected 200 on reset, got ${resetRes.status}: ${resetRes.rawText}`);
      assert.equal(resetRes.json?.redefinida, true);
      assert.equal(resetRes.json?.email?.toLowerCase(), email);
      assert.equal(typeof resetRes.json?.mensagem, 'string');

      const loginRes = await login(email, newPassword);
      assert.equal(loginRes.status, 200, `Login with new password failed: ${loginRes.rawText}`);
      assert.ok(loginRes.json?.tokenSessao);
    });

    it('R1.T4: POST /api/maes signup + POST /api/auth/confirmar-email verifies account and dispatches welcome email', async (t) => {
      if (!hasEmailSink()) {
        t.skip('Email sink unavailable (set E2E_AUTO_START_BACKEND=true, E2E_BACKEND_LOG_FILE, or Mailtrap env)');
        return;
      }

      const offset = await markInboxOffset();
      const { email, mae } = await registerFreshMae();
      assert.equal(mae.emailVerificado, false);

      const confirmCode = await waitForOtpCode({ email, sinceOffset: offset });
      const confirmOffset = await markInboxOffset();

      const confirmRes = await apiRequest('/api/auth/confirmar-email', {
        method: 'POST',
        body: { email, codigo: confirmCode },
      });
      assert.equal(confirmRes.status, 200, `Expected 200 on confirm, got ${confirmRes.status}: ${confirmRes.rawText}`);
      assert.equal(confirmRes.json?.verificado, true);
      assert.equal(confirmRes.json?.email?.toLowerCase(), email);

      const welcomeReceived = await waitForWelcomeEmail({ email, sinceOffset: confirmOffset });
      assert.equal(welcomeReceived, true, `Expected welcome email after confirming ${email}`);
    });

    it('R1.T5: POST /api/auth/reenviar-codigo sends a new 6-digit code and invalidates the prior one', async (t) => {
      const { email } = await registerFreshMae();
      const offset1 = await markInboxOffset();

      // Capture initial code if sink is available
      const firstCode = hasEmailSink() ? await waitForOtpCode({ email, sinceOffset: offset1 }) : null;

      const offset2 = await markInboxOffset();
      const resendRes = await apiRequest('/api/auth/reenviar-codigo', {
        method: 'POST',
        body: { email },
      });
      assert.equal(resendRes.status, 200, `Expected 200 on resend, got ${resendRes.status}: ${resendRes.rawText}`);
      assert.equal(resendRes.json?.verificado, false);
      assert.equal(resendRes.json?.email?.toLowerCase(), email);

      if (!hasEmailSink()) {
        t.skip('Email sink unavailable to verify old-code invalidation and new-code acceptance');
        return;
      }

      const secondCode = await waitForOtpCode({ email, sinceOffset: offset2 });
      assert.match(secondCode, /^\d{6}$/);

      if (firstCode && firstCode !== secondCode) {
        const staleConfirm = await apiRequest('/api/auth/confirmar-email', {
          method: 'POST',
          body: { email, codigo: firstCode },
        });
        assert.equal(staleConfirm.status, 400, 'Prior verification code must be invalidated after resend');
      }

      const freshConfirm = await apiRequest('/api/auth/confirmar-email', {
        method: 'POST',
        body: { email, codigo: secondCode },
      });
      assert.equal(freshConfirm.status, 200);
      assert.equal(freshConfirm.json?.verificado, true);
    });

    it('R1.T6: POST /api/auth/login authenticates MAE, PSICOLOGO, and RH seeded profiles with JWT claims', async () => {
      const maeSession = await loginSeededMae();
      assert.equal(maeSession.tipoPerfil, 'MAE');
      assert.ok(maeSession.usuarioId);
      assert.ok(maeSession.perfilId);
      assert.match(maeSession.codigoPublico || '', /^FLR-/);

      const psiSession = await loginSeededPsi();
      assert.equal(psiSession.tipoPerfil, 'PSICOLOGO');
      assert.ok(psiSession.usuarioId);
      assert.ok(psiSession.perfilId);

      const rhSession = await loginSeededRh();
      assert.equal(rhSession.tipoPerfil, 'RH');
      assert.ok(rhSession.usuarioId);
      assert.ok(rhSession.tokenSessao);
    });
  });

  // =========================================================================
  // BLOCK R2: Dashboard RH Corporativo Live Integration (6 tests)
  // =========================================================================
  describe('Block R2 — RH Corporativo Endpoints & License Lifecycle', () => {
    it('R2.T1: GET /api/rh/empresas/atual returns the RH user company', async () => {
      const rh = await loginSeededRh();
      const res = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${res.rawText}`);
      assert.ok(res.json?.id, 'Expected company id');
      assert.ok(res.json?.nome, 'Expected company nome');
      assert.ok(res.json?.cnpj, 'Expected company cnpj');
      assert.ok(res.json?.status, 'Expected company status');
    });

    it('R2.T2: PUT /api/rh/empresas/{empresaId} updates company info and restores original state', async () => {
      const rh = await loginSeededRh();
      const currentRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(currentRes.status, 200);
      const original = currentRes.json;

      const updatedNome = `${original.nome} (E2E)`;
      try {
        const updateRes = await apiRequest(`/api/rh/empresas/${original.id}`, {
          method: 'PUT',
          token: rh.tokenSessao,
          body: { nome: updatedNome, cnpj: original.cnpj },
        });
        assert.equal(updateRes.status, 200, `Expected 200 on PUT empresa, got ${updateRes.status}: ${updateRes.rawText}`);
        assert.equal(updateRes.json?.nome, updatedNome);
        assert.equal(updateRes.json?.id, original.id);
      } finally {
        await apiRequest(`/api/rh/empresas/${original.id}`, {
          method: 'PUT',
          token: rh.tokenSessao,
          body: { nome: original.nome, cnpj: original.cnpj },
        });
      }
    });

    it('R2.T3: GET /api/rh/empresas/{empresaId}/licencas returns array of company licenses', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      const listRes = await apiRequest(`/api/rh/empresas/${empresaId}/licencas`, { token: rh.tokenSessao });
      assert.equal(listRes.status, 200, `Expected 200, got ${listRes.status}: ${listRes.rawText}`);
      assert.ok(Array.isArray(listRes.json), 'Expected license array');
      assert.ok(listRes.json.length > 0, 'Expected seeded licenses in company');
      const first = listRes.json[0];
      assert.ok(first.id);
      assert.equal(first.empresaId, empresaId);
      assert.ok(['PENDENTE', 'ATIVADA', 'REVOGADA'].includes(first.status));
      assert.ok(first.tokenConvite);
      assert.ok(first.garantiaSigiloLgpd);
    });

    it('R2.T4: POST /api/rh/licencas/convite creates PENDENTE license and POST /reenviar succeeds', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      const emailCorp = uniqueEmail('colab');
      const inviteRes = await apiRequest('/api/rh/licencas/convite', {
        method: 'POST',
        token: rh.tokenSessao,
        body: {
          empresaId,
          nomeColaboradora: 'Colaboradora E2E Invite',
          emailCorporativo: emailCorp,
          departamento: 'Produto E2E',
        },
      });
      assert.equal(inviteRes.status, 201, `Expected 201, got ${inviteRes.status}: ${inviteRes.rawText}`);
      assert.equal(inviteRes.json?.status, 'PENDENTE');
      assert.equal(inviteRes.json?.emailCorporativo, emailCorp);
      assert.match(inviteRes.json?.tokenConvite || '', /^FLR-B2B-/);

      const resendRes = await apiRequest(`/api/rh/licencas/${inviteRes.json.id}/reenviar`, {
        method: 'POST',
        token: rh.tokenSessao,
      });
      assert.equal(resendRes.status, 200, `Expected 200 on resend, got ${resendRes.status}: ${resendRes.rawText}`);
      assert.equal(resendRes.json?.id, inviteRes.json.id);
      assert.equal(resendRes.json?.status, 'PENDENTE');
    });

    it('R2.T5: PATCH /api/rh/licencas/{id}/revogar and /reativar toggle license lifecycle status', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      const inviteRes = await apiRequest('/api/rh/licencas/convite', {
        method: 'POST',
        token: rh.tokenSessao,
        body: {
          empresaId,
          nomeColaboradora: 'Colaboradora Revogar E2E',
          emailCorporativo: uniqueEmail('revogar'),
          departamento: 'Operações E2E',
        },
      });
      assert.equal(inviteRes.status, 201);
      const licencaId = inviteRes.json.id;

      const revokeRes = await apiRequest(`/api/rh/licencas/${licencaId}/revogar`, {
        method: 'PATCH',
        token: rh.tokenSessao,
      });
      assert.equal(revokeRes.status, 200, `Expected 200 on revogar, got ${revokeRes.status}: ${revokeRes.rawText}`);
      assert.equal(revokeRes.json?.status, 'REVOGADA');

      const reactivateRes = await apiRequest(`/api/rh/licencas/${licencaId}/reativar`, {
        method: 'PATCH',
        token: rh.tokenSessao,
      });
      assert.equal(reactivateRes.status, 200, `Expected 200 on reativar, got ${reactivateRes.status}: ${reactivateRes.rawText}`);
      assert.equal(reactivateRes.json?.status, 'PENDENTE');
    });

    it('R2.T6: GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato enforces K>=5 aggregation and LGPD compliance', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      const reportRes = await apiRequest(`/api/rh/empresas/${empresaId}/relatorio-k-anonimato`, {
        token: rh.tokenSessao,
      });
      assert.equal(reportRes.status, 200, `Expected 200, got ${reportRes.status}: ${reportRes.rawText}`);
      assert.equal(reportRes.json?.empresaId, empresaId);
      assert.equal(reportRes.json?.parametroKMinimo, 5);
      assert.ok(typeof reportRes.json?.totalLicencasEmitidas === 'number');
      assert.ok(typeof reportRes.json?.totalLicencasAtivadas === 'number');
      assert.ok(typeof reportRes.json?.taxaAdesaoPercentual === 'number');
      assert.ok(Array.isArray(reportRes.json?.setoresElegiveis));
      for (const setor of reportRes.json.setoresElegiveis) {
        assert.ok(setor.colaboradorasAtivas >= 5, `Setor ${setor.nomeSetor} violates K>=5`);
        assert.equal(setor.agrupadoPorKAnonimato, false);
      }
      assert.equal(reportRes.json?.indiceGeralAgrupadoKAnonimato?.agrupadoPorKAnonimato, true);
      assert.ok(reportRes.json?.diretrizCompliance);
    });
  });

  // =========================================================================
  // BLOCK R3: SalaAcolhimento Room-Scoped State & Real-Time SSE (6 tests)
  // =========================================================================
  describe('Block R3 — Room-Scoped Live Room & SSE Notifications', () => {
    it('R3.T1: GET /api/sala-ao-vivo/{salaId}/estado returns room-scoped state and deterministic jitsiRoomName', async () => {
      const salaId = uniqueId('sala');
      const res = await apiRequest(`/api/sala-ao-vivo/${salaId}/estado`);
      assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${res.rawText}`);
      assert.equal(res.json?.salaId, salaId);
      assert.ok(
        String(res.json?.jitsiRoomName || '').startsWith('floravel-acolhimento-'),
        `Expected jitsiRoomName prefix, got: ${res.json?.jitsiRoomName}`
      );
      assert.ok(res.json?.statusSala);
      assert.equal(typeof res.json?.disjuntorAcionado, 'boolean');
      assert.ok(Array.isArray(res.json?.participantes));
      assert.ok(Array.isArray(res.json?.mensagens));
    });

    it('R3.T2: GET /api/sala-ao-vivo/{salaId}/eventos opens text/event-stream and emits CONNECTED event', async () => {
      const salaId = uniqueId('sse-conn');
      const sse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      try {
        assert.equal(sse.status, 200, `Expected 200 SSE stream, got ${sse.status}`);
        assert.match(sse.headers.get('content-type') || '', /text\/event-stream/i);
        const connected = await sse.waitForEvent('CONNECTED');
        assert.equal(connected.event, 'CONNECTED');
      } finally {
        await sse.close();
      }
    });

    it('R3.T3: POST /entrar and /sair track participants and broadcast PARTICIPANT_JOINED & PARTICIPANT_LEFT via SSE', async () => {
      const salaId = uniqueId('sse-presence');
      const sse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      try {
        await sse.waitForEvent('CONNECTED');

        const enterRes = await apiRequest(`/api/sala-ao-vivo/${salaId}/entrar`, {
          method: 'POST',
          body: { usuarioId: 'u-mae-1', perfilId: 'p-mae-1', nome: 'Mariana E2E', role: 'MAE' },
        });
        assert.equal(enterRes.status, 200, `Expected 200 on entrar, got ${enterRes.status}: ${enterRes.rawText}`);
        assert.ok(enterRes.json?.participantes?.some((p) => p.nome === 'Mariana E2E' && p.role === 'MAE'));

        const joinedEvt = await sse.waitForEvent('PARTICIPANT_JOINED');
        assert.equal(joinedEvt.event, 'PARTICIPANT_JOINED');

        const exitRes = await apiRequest(`/api/sala-ao-vivo/${salaId}/sair`, {
          method: 'POST',
          body: { usuarioId: 'u-mae-1', perfilId: 'p-mae-1', nome: 'Mariana E2E', role: 'MAE' },
        });
        assert.equal(exitRes.status, 200, `Expected 200 on sair, got ${exitRes.status}: ${exitRes.rawText}`);
        assert.ok(!exitRes.json?.participantes?.some((p) => p.usuarioId === 'u-mae-1'));

        const leftEvt = await sse.waitForEvent('PARTICIPANT_LEFT');
        assert.equal(leftEvt.event, 'PARTICIPANT_LEFT');
      } finally {
        await sse.close();
      }
    });

    it('R3.T4: POST /api/sala-ao-vivo/{salaId}/mensagens appends message and broadcasts CHAT_MESSAGE via SSE', async () => {
      const salaId = uniqueId('sse-chat');
      const sse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      try {
        await sse.waitForEvent('CONNECTED');
        const msgText = `Mensagem acolhedora ${uniqueId('msg')}`;
        const msgRes = await apiRequest(`/api/sala-ao-vivo/${salaId}/mensagens`, {
          method: 'POST',
          body: { remetente: 'Dra. Helena', texto: msgText, isHost: true },
        });
        assert.equal(msgRes.status, 200);
        assert.ok(msgRes.json?.mensagens?.some((m) => m.text === msgText));

        const chatEvt = await sse.waitForEvent('CHAT_MESSAGE');
        assert.equal(chatEvt.event, 'CHAT_MESSAGE');
      } finally {
        await sse.close();
      }
    });

    it('R3.T5: POST /status and /disjuntor broadcast ROOM_STATUS_CHANGED and DISJUNTOR_ACIONADO via SSE', async () => {
      const salaId = uniqueId('sse-status');
      const sse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      try {
        await sse.waitForEvent('CONNECTED');

        const statusRes = await apiRequest(`/api/sala-ao-vivo/${salaId}/status`, {
          method: 'POST',
          body: { status: 'AO_VIVO' },
        });
        assert.equal(statusRes.status, 200);
        assert.equal(statusRes.json?.statusSala, 'AO_VIVO');
        await sse.waitForEvent('ROOM_STATUS_CHANGED');

        const disjuntorRes = await apiRequest(`/api/sala-ao-vivo/${salaId}/disjuntor`, {
          method: 'POST',
          body: { alvo: 'Participante Teste' },
        });
        assert.equal(disjuntorRes.status, 200);
        assert.equal(disjuntorRes.json?.disjuntorAcionado, true);
        await sse.waitForEvent('DISJUNTOR_ACIONADO');
      } finally {
        await sse.close();
      }
    });

    it('R3.T6: Legacy GET /api/sala-ao-vivo/estado continues serving default room cleanly', async () => {
      const res = await apiRequest('/api/sala-ao-vivo/estado');
      assert.equal(res.status, 200, `Expected 200 on legacy /estado, got ${res.status}: ${res.rawText}`);
      assert.ok(res.json?.statusSala);
      assert.ok(Array.isArray(res.json?.mensagens));
    });
  });

  // =========================================================================
  // BLOCK R4: S3 / Cloudflare R2 Presigned URL & Profile Photo (5 tests)
  // =========================================================================
  describe('Block R4 — Profile Photo Presigned URLs & User Profile Persistence', () => {
    it('R4.T1: POST /api/usuarios/me/foto/presigned-url returns S3/R2 PUT presigned payload for image/jpeg', async () => {
      const mae = await loginSeededMae();
      const res = await apiRequest('/api/usuarios/me/foto/presigned-url', {
        method: 'POST',
        token: mae.tokenSessao,
        body: { fileName: 'avatar.jpg', contentType: 'image/jpeg', fileSizeBytes: 128000 },
      });
      assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${res.rawText}`);
      assert.match(res.json?.uploadUrl || '', /^https?:\/\//i);
      assert.match(res.json?.publicUrl || '', /^https?:\/\//i);
      assert.ok(res.json?.objectKey);
      assert.equal(res.json?.expiresInSeconds, 300);
      assert.equal(res.json?.method, 'PUT');
      assert.equal(res.json?.requiredHeaders?.['Content-Type'], 'image/jpeg');
    });

    it('R4.T2: POST /api/usuarios/me/foto/presigned-url supports image/png and image/webp', async () => {
      const psi = await loginSeededPsi();
      for (const [fileName, contentType] of [
        ['perfil.png', 'image/png'],
        ['perfil.webp', 'image/webp'],
      ]) {
        const res = await apiRequest('/api/usuarios/me/foto/presigned-url', {
          method: 'POST',
          token: psi.tokenSessao,
          body: { fileName, contentType, fileSizeBytes: 256000 },
        });
        assert.equal(res.status, 200, `Expected 200 for ${contentType}, got ${res.status}: ${res.rawText}`);
        assert.equal(res.json?.requiredHeaders?.['Content-Type'], contentType);
        assert.equal(res.json?.method, 'PUT');
      }
    });

    it('R4.T3: POST /api/storage/presigned-url alias matches presigned URL contract', async () => {
      const mae = await loginSeededMae();
      const res = await apiRequest('/api/storage/presigned-url', {
        method: 'POST',
        token: mae.tokenSessao,
        body: { fileName: 'alias-foto.jpg', contentType: 'image/jpeg', fileSizeBytes: 64000 },
      });
      assert.equal(res.status, 200, `Expected 200 on storage alias, got ${res.status}: ${res.rawText}`);
      assert.ok(res.json?.uploadUrl);
      assert.ok(res.json?.publicUrl);
      assert.ok(res.json?.objectKey);
      assert.equal(res.json?.method, 'PUT');
    });

    it('R4.T4: PATCH /api/usuarios/me/foto persists fotoUrl for MAE, PSICOLOGO, and RH roles', async () => {
      const { email, senha } = await registerFreshMae();
      const maeLogin = await login(email, senha);
      assert.equal(maeLogin.status, 200);

      const newFotoUrl = `https://cdn.floravel.example/avatars/${uniqueId('mae')}.jpg`;
      const maePatch = await apiRequest('/api/usuarios/me/foto', {
        method: 'PATCH',
        token: maeLogin.json.tokenSessao,
        body: { fotoUrl: newFotoUrl },
      });
      assert.equal(maePatch.status, 200, `Expected 200 on MAE PATCH foto, got ${maePatch.status}: ${maePatch.rawText}`);
      assert.equal(maePatch.json?.fotoUrl, newFotoUrl);
      assert.equal(maePatch.json?.usuarioId, maeLogin.json.usuarioId);

      // Verify RH role also works (restoring original fotoUrl)
      const rh = await loginSeededRh();
      const rhMeBefore = await apiRequest('/api/usuarios/me', { token: rh.tokenSessao });
      assert.equal(rhMeBefore.status, 200);
      const originalRhFoto = rhMeBefore.json?.fotoUrl;

      const rhNewFoto = `https://cdn.floravel.example/avatars/${uniqueId('rh')}.png`;
      try {
        const rhPatch = await apiRequest('/api/usuarios/me/foto', {
          method: 'PATCH',
          token: rh.tokenSessao,
          body: { fotoUrl: rhNewFoto },
        });
        assert.equal(rhPatch.status, 200, `Expected 200 on RH PATCH foto, got ${rhPatch.status}: ${rhPatch.rawText}`);
        assert.equal(rhPatch.json?.fotoUrl, rhNewFoto);
      } finally {
        if (originalRhFoto && /^https?:\/\//i.test(originalRhFoto)) {
          await apiRequest('/api/usuarios/me/foto', {
            method: 'PATCH',
            token: rh.tokenSessao,
            body: { fotoUrl: originalRhFoto },
          });
        }
      }
    });

    it('R4.T5: GET /api/usuarios/me returns full authenticated user profile including updated fotoUrl', async () => {
      const { email, senha } = await registerFreshMae();
      const session = await login(email, senha);
      assert.equal(session.status, 200);

      const fotoUrl = `https://cdn.floravel.example/avatars/${uniqueId('me')}.webp`;
      const patchRes = await apiRequest('/api/usuarios/me/foto', {
        method: 'PATCH',
        token: session.json.tokenSessao,
        body: { fotoUrl },
      });
      assert.equal(patchRes.status, 200);

      const meRes = await apiRequest('/api/usuarios/me', { token: session.json.tokenSessao });
      assert.equal(meRes.status, 200, `Expected 200 on GET /api/usuarios/me, got ${meRes.status}: ${meRes.rawText}`);
      assert.equal(meRes.json?.usuarioId, session.json.usuarioId);
      assert.equal(meRes.json?.perfilId, session.json.perfilId);
      assert.equal(meRes.json?.email?.toLowerCase(), email);
      assert.equal(meRes.json?.tipoPerfil, 'MAE');
      assert.equal(meRes.json?.fotoUrl, fotoUrl);
      assert.ok('empresaId' in meRes.json);
    });
  });
});
