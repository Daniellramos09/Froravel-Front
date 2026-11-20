import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildJitsiRoomName } from './jitsi.js';
import { conectarEventosSala } from './salaEventos.js';

describe('@floravel/shared M3 helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sanitiza salaId para nome determinístico do Jitsi', () => {
    expect(buildJitsiRoomName('roda-primeiros-meses')).toBe('floravel-acolhimento-roda-primeiros-meses');
    expect(buildJitsiRoomName('sala 123/abc!')).toBe('floravel-acolhimento-sala-123-abc');
    expect(buildJitsiRoomName('')).toBe('floravel-acolhimento-default');
  });

  it('conecta EventSource com token opcional e despacha eventos SSE', () => {
    const listeners = {};
    const closeSpy = vi.fn();
    let capturedUrl = '';

    class MockEventSource {
      constructor(url) {
        capturedUrl = url;
      }
      addEventListener(name, cb) {
        listeners[name] = cb;
      }
      close() {
        closeSpy();
      }
    }

    vi.stubGlobal('EventSource', MockEventSource);

    const onJoined = vi.fn();
    const onChat = vi.fn();
    const disconnect = conectarEventosSala({
      apiBase: 'http://localhost:8080',
      salaId: 'roda-1',
      token: 'jwt-abc',
      onParticipantJoined: onJoined,
      onChatMessage: onChat,
    });

    expect(capturedUrl).toBe('http://localhost:8080/api/sala-ao-vivo/roda-1/eventos?token=jwt-abc');

    listeners.PARTICIPANT_JOINED({
      data: JSON.stringify({ participante: { nome: 'Mariana', role: 'MAE' } }),
    });
    expect(onJoined).toHaveBeenCalledWith(
      { participante: { nome: 'Mariana', role: 'MAE' } },
      expect.any(Object)
    );

    listeners.CHAT_MESSAGE({
      data: JSON.stringify({ mensagem: { sender: 'Dra. Helena', text: 'Olá' } }),
    });
    expect(onChat).toHaveBeenCalledWith(
      { mensagem: { sender: 'Dra. Helena', text: 'Olá' } },
      expect.any(Object)
    );

    disconnect();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
