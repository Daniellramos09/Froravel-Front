import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  apiRequest,
  connectSseStream,
  corsPreflight,
  uniqueEmail,
  uniqueId,
} from './helpers/http-client.mjs';
import {
  hasEmailSink,
  markInboxOffset,
  waitForOtpCode,
} from './helpers/email-otp.mjs';
import {
  loginSeededMae,
  loginSeededPsi,
  loginSeededRh,
  registerFreshMae,
} from './helpers/auth-fixtures.mjs';

describe('Tier 2 — Boundary, Validation, Security & Corner Cases (Blocks R1–R4)', () => {
  // =========================================================================
  // BLOCK R1 BOUNDARIES (6 tests)
  // =========================================================================
  describe('Block R1 Boundaries — Auth & Password Recovery', () => {
    it('R1.B1: POST /api/auth/redefinir-senha rejects wrong 6-digit code with 400 Bad Request', async () => {
      const { email } = await registerFreshMae();
      const forgotRes = await apiRequest('/api/auth/esqueci-senha', {
        method: 'POST',
        body: { email },
      });
      assert.equal(forgotRes.status, 200);

      const resetRes = await apiRequest('/api/auth/redefinir-senha', {
        method: 'POST',
        body: { email, codigo: '000000', novaSenha: 'NovaSenhaValida1' },
      });
      // Even in the 1-in-1,000,000 collision chance, a second attempt with 999999 would differ
      if (resetRes.status === 200) {
        const secondAttempt = await apiRequest('/api/auth/redefinir-senha', {
          method: 'POST',
          body: { email, codigo: '999999', novaSenha: 'NovaSenhaValida2' },
        });
        assert.equal(secondAttempt.status, 400);
      } else {
        assert.equal(resetRes.status, 400, `Expected 400 for wrong code, got ${resetRes.status}: ${resetRes.rawText}`);
      }
    });

    it('R1.B2: POST /api/auth/redefinir-senha rejects reused reset code (single-use enforcement, 400)', async (t) => {
      if (!hasEmailSink()) {
        t.skip('Email sink unavailable to obtain valid reset code for single-use reuse test');
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

      const firstReset = await apiRequest('/api/auth/redefinir-senha', {
        method: 'POST',
        body: { email, codigo: code, novaSenha: 'PrimeiraSenha123' },
      });
      assert.equal(firstReset.status, 200);

      const replayReset = await apiRequest('/api/auth/redefinir-senha', {
        method: 'POST',
        body: { email, codigo: code, novaSenha: 'SegundaSenha123' },
      });
      assert.equal(replayReset.status, 400, `Reused code must return 400, got ${replayReset.status}: ${replayReset.rawText}`);
    });

    it('R1.B3: POST /api/auth/redefinir-senha rejects non-6-digit codes ("abc", "123", empty) with 400', async () => {
      const { email } = await registerFreshMae();
      for (const badCode of ['abc', '123', '1234567', '']) {
        const res = await apiRequest('/api/auth/redefinir-senha', {
          method: 'POST',
          body: { email, codigo: badCode, novaSenha: 'SenhaValida123' },
        });
        assert.equal(res.status, 400, `Expected 400 for codigo="${badCode}", got ${res.status}`);
      }
    });

    it('R1.B4: POST /api/auth/esqueci-senha rejects malformed or blank email with 400 Bad Request', async () => {
      for (const badEmail of ['not-an-email', 'missing@', '', '   ']) {
        const res = await apiRequest('/api/auth/esqueci-senha', {
          method: 'POST',
          body: { email: badEmail },
        });
        assert.equal(res.status, 400, `Expected 400 for email="${badEmail}", got ${res.status}: ${res.rawText}`);
      }
    });

    it('R1.B5: POST /api/auth/redefinir-senha rejects short password (<6 chars) with 400 Bad Request', async () => {
      const { email } = await registerFreshMae();
      for (const shortPass of ['12345', 'a', '']) {
        const res = await apiRequest('/api/auth/redefinir-senha', {
          method: 'POST',
          body: { email, codigo: '123456', novaSenha: shortPass },
        });
        assert.equal(res.status, 400, `Expected 400 for novaSenha="${shortPass}", got ${res.status}`);
      }
    });

    it('R1.B6: Requesting a second reset code invalidates prior unused reset code (400 on prior code)', async (t) => {
      if (!hasEmailSink()) {
        t.skip('Email sink unavailable to compare first vs second reset code');
        return;
      }

      const { email } = await registerFreshMae();

      const offset1 = await markInboxOffset();
      assert.equal((await apiRequest('/api/auth/esqueci-senha', { method: 'POST', body: { email } })).status, 200);
      const code1 = await waitForOtpCode({ email, sinceOffset: offset1 });

      const offset2 = await markInboxOffset();
      assert.equal((await apiRequest('/api/auth/esqueci-senha', { method: 'POST', body: { email } })).status, 200);
      const code2 = await waitForOtpCode({ email, sinceOffset: offset2 });

      if (code1 !== code2) {
        const oldAttempt = await apiRequest('/api/auth/redefinir-senha', {
          method: 'POST',
          body: { email, codigo: code1, novaSenha: 'NovaSenha123' },
        });
        assert.equal(oldAttempt.status, 400, 'Superseded reset code must fail with 400');
      }

      const newAttempt = await apiRequest('/api/auth/redefinir-senha', {
        method: 'POST',
        body: { email, codigo: code2, novaSenha: 'NovaSenha123' },
      });
      assert.equal(newAttempt.status, 200);
    });
  });

  // =========================================================================
  // BLOCK R2 BOUNDARIES (6 tests)
  // =========================================================================
  describe('Block R2 Boundaries — RH Authorization, Duplicates & K-Anonymity', () => {
    it('R2.B1: Unauthenticated requests to RH endpoints return 401 Unauthorized', async () => {
      const checks = [
        apiRequest('/api/rh/empresas/atual'),
        apiRequest('/api/rh/empresas/any-id/licencas'),
        apiRequest('/api/rh/empresas/any-id/relatorio-k-anonimato'),
        apiRequest('/api/rh/licencas/convite', {
          method: 'POST',
          body: {
            empresaId: 'any-id',
            nomeColaboradora: 'Test',
            emailCorporativo: 'test@example.com',
            departamento: 'Engenharia',
          },
        }),
        apiRequest('/api/rh/licencas/any-id/revogar', { method: 'PATCH' }),
      ];
      const results = await Promise.all(checks);
      for (const res of results) {
        assert.equal(res.status, 401, `Expected 401 without JWT, got ${res.status}: ${res.rawText}`);
      }
    });

    it('R2.B2: MAE and PSICOLOGO roles are forbidden (403) from RH endpoints', async () => {
      const mae = await loginSeededMae();
      const psi = await loginSeededPsi();
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      for (const actor of [mae, psi]) {
        const atualRes = await apiRequest('/api/rh/empresas/atual', { token: actor.tokenSessao });
        assert.equal(atualRes.status, 403, `Expected 403 for ${actor.tipoPerfil} on /empresas/atual, got ${atualRes.status}`);

        const licRes = await apiRequest(`/api/rh/empresas/${empresaId}/licencas`, { token: actor.tokenSessao });
        assert.equal(licRes.status, 403, `Expected 403 for ${actor.tipoPerfil} on /licencas, got ${licRes.status}`);

        const inviteRes = await apiRequest('/api/rh/licencas/convite', {
          method: 'POST',
          token: actor.tokenSessao,
          body: {
            empresaId,
            nomeColaboradora: 'Nao Autorizada',
            emailCorporativo: uniqueEmail('unauth'),
            departamento: 'Engenharia',
          },
        });
        assert.equal(inviteRes.status, 403, `Expected 403 for ${actor.tipoPerfil} on /convite, got ${inviteRes.status}`);

        const revRes = await apiRequest('/api/rh/licencas/fake-id/revogar', {
          method: 'PATCH',
          token: actor.tokenSessao,
        });
        assert.equal(revRes.status, 403, `Expected 403 for ${actor.tipoPerfil} on /revogar, got ${revRes.status}`);
      }
    });

    it('R2.B3: Duplicate RH invite for same empresaId + emailCorporativo returns 422', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;
      const emailCorp = uniqueEmail('dup');

      const first = await apiRequest('/api/rh/licencas/convite', {
        method: 'POST',
        token: rh.tokenSessao,
        body: {
          empresaId,
          nomeColaboradora: 'Colaboradora Duplicada',
          emailCorporativo: emailCorp,
          departamento: 'RH',
        },
      });
      assert.equal(first.status, 201);

      const second = await apiRequest('/api/rh/licencas/convite', {
        method: 'POST',
        token: rh.tokenSessao,
        body: {
          empresaId,
          nomeColaboradora: 'Colaboradora Duplicada',
          emailCorporativo: emailCorp,
          departamento: 'RH',
        },
      });
      assert.equal(second.status, 422, `Expected 422 on duplicate invite, got ${second.status}: ${second.rawText}`);
    });

    it('R2.B4: Invalid invite payload (malformed email, blank fields) returns 400 Bad Request', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      const badEmail = await apiRequest('/api/rh/licencas/convite', {
        method: 'POST',
        token: rh.tokenSessao,
        body: {
          empresaId,
          nomeColaboradora: 'Maria',
          emailCorporativo: 'invalid-email',
          departamento: 'Engenharia',
        },
      });
      assert.equal(badEmail.status, 400);

      const blankDept = await apiRequest('/api/rh/licencas/convite', {
        method: 'POST',
        token: rh.tokenSessao,
        body: {
          empresaId,
          nomeColaboradora: '',
          emailCorporativo: uniqueEmail('blank'),
          departamento: '',
        },
      });
      assert.equal(blankDept.status, 400);
    });

    it('R2.B5: Cross-tenant empresaId or non-existent licencaId is rejected cleanly (never 200 or 500)', async () => {
      const rh = await loginSeededRh();
      const fakeEmpresa = '00000000-0000-0000-0000-000000000000';
      const fakeLicenca = '00000000-0000-0000-0000-000000000001';

      const crossTenant = await apiRequest(`/api/rh/empresas/${fakeEmpresa}/licencas`, {
        token: rh.tokenSessao,
      });
      assert.ok([403, 404, 422].includes(crossTenant.status), `Unexpected status ${crossTenant.status} for unknown/foreign empresaId`);

      const missingLicense = await apiRequest(`/api/rh/licencas/${fakeLicenca}/revogar`, {
        method: 'PATCH',
        token: rh.tokenSessao,
      });
      assert.ok([403, 404, 422].includes(missingLicense.status), `Unexpected status ${missingLicense.status} for missing licencaId`);
    });

    it('R2.B6: K-anonymity report suppresses departments with <5 active licenses into general index', async () => {
      const rh = await loginSeededRh();
      const empRes = await apiRequest('/api/rh/empresas/atual', { token: rh.tokenSessao });
      assert.equal(empRes.status, 200);
      const empresaId = empRes.json.id;

      // Seeded TechMães has Jurídico (2) & Design (2) < 5, and Engenharia (6) >= 5
      const reportRes = await apiRequest(`/api/rh/empresas/${empresaId}/relatorio-k-anonimato`, {
        token: rh.tokenSessao,
      });
      assert.equal(reportRes.status, 200);
      const eligibleNames = (reportRes.json?.setoresElegiveis || []).map((s) => s.nomeSetor);
      assert.ok(!eligibleNames.includes('Jurídico'), 'Department with <5 active licenses must NOT appear in setoresElegiveis');
      assert.ok(!eligibleNames.includes('Design'), 'Department with <5 active licenses must NOT appear in setoresElegiveis');
      assert.ok(
        reportRes.json?.indiceGeralAgrupadoKAnonimato?.colaboradorasAtivas >= 4,
        'Small departments must be aggregated into indiceGeralAgrupadoKAnonimato'
      );
    });
  });

  // =========================================================================
  // BLOCK R3 BOUNDARIES (6 tests)
  // =========================================================================
  describe('Block R3 Boundaries — Room Isolation, Sanitization & SSE CORS', () => {
    it('R3.B1: Room isolation — events and state in salaA never leak to salaB', async () => {
      const salaA = uniqueId('iso-a');
      const salaB = uniqueId('iso-b');
      const sseB = await connectSseStream(`/api/sala-ao-vivo/${salaB}/eventos`);
      try {
        await sseB.waitForEvent('CONNECTED');
        const secretMsg = `Isolated-${uniqueId('secret')}`;
        await apiRequest(`/api/sala-ao-vivo/${salaA}/entrar`, {
          method: 'POST',
          body: { usuarioId: 'u-iso', nome: 'Participante Sala A', role: 'MAE' },
        });
        await apiRequest(`/api/sala-ao-vivo/${salaA}/mensagens`, {
          method: 'POST',
          body: { remetente: 'Sala A', texto: secretMsg, isHost: false },
        });
        await apiRequest(`/api/sala-ao-vivo/${salaA}/disjuntor`, {
          method: 'POST',
          body: { alvo: 'Alvo A' },
        });

        await new Promise((r) => setTimeout(r, 400));
        const leaked = sseB.events.filter((e) => e.event !== 'CONNECTED' && e.event !== 'HEARTBEAT');
        assert.equal(leaked.length, 0, `Sala B SSE received leaked events from Sala A: ${JSON.stringify(leaked)}`);

        const stateB = await apiRequest(`/api/sala-ao-vivo/${salaB}/estado`);
        assert.equal(stateB.status, 200);
        assert.equal(stateB.json?.disjuntorAcionado, false);
        assert.ok(!stateB.json?.mensagens?.some((m) => m.text === secretMsg));
      } finally {
        await sseB.close();
      }
    });

    it('R3.B2: Jitsi room name sanitizes special characters in salaId', async () => {
      const dirtyId = 'Roda@Demo!2026_Segura';
      const res = await apiRequest(`/api/sala-ao-vivo/${encodeURIComponent(dirtyId)}/estado`);
      assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${res.rawText}`);
      assert.match(res.json?.jitsiRoomName || '', /^floravel-acolhimento-[a-zA-Z0-9_-]+$/);
    });

    it('R3.B3: CORS preflight OPTIONS allows Last-Event-ID and Cache-Control headers for SSE', async () => {
      const salaId = uniqueId('cors');
      const preflight = await corsPreflight(`/api/sala-ao-vivo/${salaId}/eventos`, {
        origin: 'http://localhost:5174',
        requestMethod: 'GET',
        requestHeaders: ['Last-Event-ID', 'Cache-Control', 'Authorization'],
      });
      assert.ok([200, 204].includes(preflight.status), `Expected 200/204 preflight, got ${preflight.status}`);
      const allowHeaders = (preflight.headers.get('access-control-allow-headers') || '').toLowerCase();
      assert.ok(allowHeaders.includes('last-event-id'), `Missing Last-Event-ID in Allow-Headers: ${allowHeaders}`);
      assert.ok(allowHeaders.includes('cache-control'), `Missing Cache-Control in Allow-Headers: ${allowHeaders}`);
    });

    it('R3.B4: Blank/whitespace chat message is ignored and does not emit CHAT_MESSAGE', async () => {
      const salaId = uniqueId('blank-msg');
      const sse = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      try {
        await sse.waitForEvent('CONNECTED');
        const before = await apiRequest(`/api/sala-ao-vivo/${salaId}/estado`);
        const beforeCount = (before.json?.mensagens || []).length;

        const postBlank = await apiRequest(`/api/sala-ao-vivo/${salaId}/mensagens`, {
          method: 'POST',
          body: { remetente: 'Teste', texto: '   ', isHost: false },
        });
        assert.equal(postBlank.status, 200);
        assert.equal((postBlank.json?.mensagens || []).length, beforeCount);

        await new Promise((r) => setTimeout(r, 300));
        const chatEvents = sse.events.filter((e) => e.event === 'CHAT_MESSAGE');
        assert.equal(chatEvents.length, 0);
      } finally {
        await sse.close();
      }
    });

    it('R3.B5: SSE stream supports optional ?token=<jwt> query param cleanly', async () => {
      const mae = await loginSeededMae();
      const salaId = uniqueId('sse-token');
      const sse = await connectSseStream(
        `/api/sala-ao-vivo/${salaId}/eventos?token=${encodeURIComponent(mae.tokenSessao)}`
      );
      try {
        assert.equal(sse.status, 200);
        const evt = await sse.waitForEvent('CONNECTED');
        assert.equal(evt.event, 'CONNECTED');
      } finally {
        await sse.close();
      }
    });

    it('R3.B6: Disconnecting one SSE subscriber does not disrupt another subscriber on same salaId', async () => {
      const salaId = uniqueId('sse-multi');
      const sub1 = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      const sub2 = await connectSseStream(`/api/sala-ao-vivo/${salaId}/eventos`);
      try {
        await sub1.waitForEvent('CONNECTED');
        await sub2.waitForEvent('CONNECTED');

        // Abruptly disconnect sub1
        await sub1.close();

        // Trigger event and verify sub2 still receives it
        await apiRequest(`/api/sala-ao-vivo/${salaId}/entrar`, {
          method: 'POST',
          body: { usuarioId: 'u-resilient', nome: 'Dra. Resiliente', role: 'PSICOLOGO' },
        });
        const evt = await sub2.waitForEvent('PARTICIPANT_JOINED');
        assert.equal(evt.event, 'PARTICIPANT_JOINED');
      } finally {
        await sub1.close();
        await sub2.close();
      }
    });
  });

  // =========================================================================
  // BLOCK R4 BOUNDARIES (6 tests)
  // =========================================================================
  describe('Block R4 Boundaries — Storage Presigned URL & Photo Validation', () => {
    it('R4.B1: Unauthenticated requests to /api/usuarios/me* and /api/storage/presigned-url return 401', async () => {
      const calls = [
        apiRequest('/api/usuarios/me'),
        apiRequest('/api/usuarios/me/foto', {
          method: 'PATCH',
          body: { fotoUrl: 'https://cdn.floravel.example/a.jpg' },
        }),
        apiRequest('/api/usuarios/me/foto/presigned-url', {
          method: 'POST',
          body: { fileName: 'a.jpg', contentType: 'image/jpeg', fileSizeBytes: 1024 },
        }),
        apiRequest('/api/storage/presigned-url', {
          method: 'POST',
          body: { fileName: 'a.jpg', contentType: 'image/jpeg', fileSizeBytes: 1024 },
        }),
      ];
      const results = await Promise.all(calls);
      for (const res of results) {
        assert.equal(res.status, 401, `Expected 401 without JWT, got ${res.status}: ${res.rawText}`);
      }
    });

    it('R4.B2: Disallowed MIME types (SVG, PDF, text/plain, octet-stream) are rejected (400/422)', async () => {
      const mae = await loginSeededMae();
      for (const [fileName, contentType] of [
        ['xss.svg', 'image/svg+xml'],
        ['doc.pdf', 'application/pdf'],
        ['note.txt', 'text/plain'],
        ['bin.exe', 'application/octet-stream'],
      ]) {
        const res = await apiRequest('/api/usuarios/me/foto/presigned-url', {
          method: 'POST',
          token: mae.tokenSessao,
          body: { fileName, contentType, fileSizeBytes: 1024 },
        });
        assert.ok(
          [400, 422].includes(res.status),
          `Expected 400 or 422 for MIME ${contentType}, got ${res.status}: ${res.rawText}`
        );
      }
    });

    it('R4.B3: File size boundary — 5242880 (5MB) accepted, 5242881 (>5MB) rejected (400/422)', async () => {
      const mae = await loginSeededMae();

      const maxExact = await apiRequest('/api/usuarios/me/foto/presigned-url', {
        method: 'POST',
        token: mae.tokenSessao,
        body: { fileName: 'exact5mb.jpg', contentType: 'image/jpeg', fileSizeBytes: 5242880 },
      });
      assert.equal(maxExact.status, 200, `Exact 5MB must succeed, got ${maxExact.status}: ${maxExact.rawText}`);

      const overLimit = await apiRequest('/api/usuarios/me/foto/presigned-url', {
        method: 'POST',
        token: mae.tokenSessao,
        body: { fileName: 'over5mb.jpg', contentType: 'image/jpeg', fileSizeBytes: 5242881 },
      });
      assert.ok(
        [400, 422].includes(overLimit.status),
        `Expected 400/422 for 5242881 bytes, got ${overLimit.status}: ${overLimit.rawText}`
      );
    });

    it('R4.B4: Zero-byte and negative file sizes are rejected (400/422)', async () => {
      const mae = await loginSeededMae();
      for (const badSize of [0, -100]) {
        const res = await apiRequest('/api/usuarios/me/foto/presigned-url', {
          method: 'POST',
          token: mae.tokenSessao,
          body: { fileName: 'empty.png', contentType: 'image/png', fileSizeBytes: badSize },
        });
        assert.ok(
          [400, 422].includes(res.status),
          `Expected 400/422 for fileSizeBytes=${badSize}, got ${res.status}: ${res.rawText}`
        );
      }
    });

    it('R4.B5: PATCH /api/usuarios/me/foto rejects non-HTTP(S) schemes and >500 char URLs', async () => {
      const mae = await loginSeededMae();
      const badUrls = [
        'javascript:alert(1)',
        'data:image/png;base64,iVBORw0KGgo=',
        'ftp://files.example.com/avatar.png',
        'file:///etc/passwd',
        `https://cdn.floravel.example/${'a'.repeat(500)}.jpg`,
      ];
      for (const fotoUrl of badUrls) {
        const res = await apiRequest('/api/usuarios/me/foto', {
          method: 'PATCH',
          token: mae.tokenSessao,
          body: { fotoUrl },
        });
        assert.ok(
          [400, 422].includes(res.status),
          `Expected 400/422 for invalid fotoUrl (${fotoUrl.slice(0, 32)}...), got ${res.status}: ${res.rawText}`
        );
      }
    });

    it('R4.B6: Path-traversal fileName is sanitized or rejected cleanly without ".." in objectKey', async () => {
      const mae = await loginSeededMae();
      const res = await apiRequest('/api/usuarios/me/foto/presigned-url', {
        method: 'POST',
        token: mae.tokenSessao,
        body: { fileName: '../../etc/passwd.jpg', contentType: 'image/jpeg', fileSizeBytes: 2048 },
      });
      if (res.status === 200) {
        assert.ok(
          !String(res.json?.objectKey || '').includes('..'),
          `objectKey must sanitize path traversal "..", got: ${res.json?.objectKey}`
        );
      } else {
        assert.ok([400, 422].includes(res.status), `Expected 200 sanitized or 400/422, got ${res.status}`);
      }
    });
  });
});
