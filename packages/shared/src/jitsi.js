let jitsiLoaderPromise = null;

export function buildJitsiRoomName(salaId = 'default') {
  const sanitized = String(salaId || 'default')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
  return `floravel-acolhimento-${sanitized || 'default'}`;
}

export function loadJitsiExternalApi(domain = 'meet.jit.si') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }
  if (window.JitsiMeetExternalAPI) {
    return Promise.resolve(window.JitsiMeetExternalAPI);
  }
  if (jitsiLoaderPromise) {
    return jitsiLoaderPromise;
  }

  jitsiLoaderPromise = new Promise((resolve) => {
    const scriptId = 'floravel-jitsi-external-api';
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.JitsiMeetExternalAPI || null), { once: true });
      existing.addEventListener('error', () => resolve(null), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => resolve(window.JitsiMeetExternalAPI || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return jitsiLoaderPromise;
}
