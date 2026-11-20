/**
 * Helpers para sincronização em tempo real da Sala de Acolhimento via SSE (Server-Sent Events)
 * e endpoints REST com escopo por salaId.
 */

function parseEventData(event) {
  try {
    return event?.data ? JSON.parse(event.data) : {};
  } catch {
    return {};
  }
}

export function conectarEventosSala({
  apiBase,
  salaId = 'default',
  token,
  onConnected,
  onParticipantJoined,
  onParticipantLeft,
  onRoomStatusChanged,
  onChatMessage,
  onDisjuntorAcionado,
  onError,
}) {
  if (!apiBase || typeof EventSource === 'undefined') {
    return () => {};
  }

  const encodedSala = encodeURIComponent(salaId || 'default');
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  const url = `${apiBase}/api/sala-ao-vivo/${encodedSala}/eventos${query}`;
  const source = new EventSource(url);

  const bind = (eventName, handler) => {
    if (!handler) return;
    source.addEventListener(eventName, (ev) => {
      handler(parseEventData(ev), ev);
    });
  };

  bind('CONNECTED', onConnected);
  bind('PARTICIPANT_JOINED', onParticipantJoined);
  bind('PARTICIPANT_LEFT', onParticipantLeft);
  bind('ROOM_STATUS_CHANGED', onRoomStatusChanged);
  bind('CHAT_MESSAGE', onChatMessage);
  bind('DISJUNTOR_ACIONADO', onDisjuntorAcionado);

  if (onError) {
    source.onerror = onError;
  }

  return () => {
    try {
      source.close();
    } catch {
      // ignore close errors
    }
  };
}

async function postSala(apiBase, salaId, suffix, body, token) {
  if (!apiBase) return null;
  const encodedSala = encodeURIComponent(salaId || 'default');
  const res = await fetch(`${apiBase}/api/sala-ao-vivo/${encodedSala}${suffix}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function obterEstadoSala({ apiBase, salaId = 'default', token }) {
  if (!apiBase) return null;
  const encodedSala = encodeURIComponent(salaId || 'default');
  const res = await fetch(`${apiBase}/api/sala-ao-vivo/${encodedSala}/estado`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) return null;
  return res.json();
}

export function entrarSala({ apiBase, salaId = 'default', participante, token }) {
  return postSala(apiBase, salaId, '/entrar', participante, token);
}

export function sairSala({ apiBase, salaId = 'default', participante, token }) {
  return postSala(apiBase, salaId, '/sair', participante, token);
}

export function atualizarStatusSala({ apiBase, salaId = 'default', status, token }) {
  return postSala(apiBase, salaId, '/status', { status }, token);
}

export function enviarMensagemSala({ apiBase, salaId = 'default', remetente, texto, isHost = false, token }) {
  return postSala(apiBase, salaId, '/mensagens', { remetente, texto, isHost }, token);
}

export function acionarDisjuntorSala({ apiBase, salaId = 'default', alvo, token }) {
  return postSala(apiBase, salaId, '/disjuntor', { alvo }, token);
}
