import { API_BASE, DEFAULT_TIMEOUT_MS, SSE_TIMEOUT_MS } from './config.mjs';

let counter = 0;

export function uniqueId(prefix = 'e2e') {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function uniqueEmail(prefix = 'e2e') {
  return `${uniqueId(prefix)}@floravel-e2e.test`.toLowerCase();
}

/**
 * Generates a syntactically and mathematically valid Brazilian CPF (11 digits, Mod-11).
 */
export function generateValidCpf() {
  const rand = () => Math.floor(Math.random() * 9) + 1;
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  if (digits.every((d) => d === digits[0])) {
    digits[0] = rand();
  }
  const calcDigit = (slice) => {
    const weightStart = slice.length + 1;
    const sum = slice.reduce((acc, digit, idx) => acc + digit * (weightStart - idx), 0);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  digits.push(calcDigit(digits));
  digits.push(calcDigit(digits));
  return digits.join('');
}

export async function apiRequest(endpointPath, options = {}) {
  const {
    method = 'GET',
    token = null,
    body = undefined,
    headers = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const url = endpointPath.startsWith('http') ? endpointPath : `${API_BASE}${endpointPath}`;
  const reqHeaders = { ...headers };

  if (token) {
    reqHeaders.Authorization = `Bearer ${token}`;
  }
  let payload;
  if (body !== undefined) {
    if (typeof body === 'string') {
      payload = body;
    } else {
      payload = JSON.stringify(body);
    }
    if (!reqHeaders['Content-Type'] && !reqHeaders['content-type']) {
      reqHeaders['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(url, {
    method,
    headers: reqHeaders,
    body: payload,
    signal: AbortSignal.timeout(timeoutMs),
  });

  const rawText = await response.text();
  let json = null;
  if (rawText) {
    try {
      json = JSON.parse(rawText);
    } catch {
      json = null;
    }
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    rawText,
    json,
  };
}

export async function corsPreflight(endpointPath, { origin = 'http://localhost:5174', requestMethod = 'GET', requestHeaders = [] } = {}) {
  const url = endpointPath.startsWith('http') ? endpointPath : `${API_BASE}${endpointPath}`;
  const reqHeaders = {
    Origin: origin,
    'Access-Control-Request-Method': requestMethod,
  };
  if (requestHeaders.length > 0) {
    reqHeaders['Access-Control-Request-Headers'] = requestHeaders.join(', ');
  }
  const response = await fetch(url, {
    method: 'OPTIONS',
    headers: reqHeaders,
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  const rawText = await response.text();
  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    rawText,
  };
}

/**
 * Opens an SSE stream using native fetch + ReadableStream and buffers named events.
 */
export async function connectSseStream(endpointPath, options = {}) {
  const {
    token = null,
    lastEventId = null,
    headers = {},
    connectTimeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const url = endpointPath.startsWith('http') ? endpointPath : `${API_BASE}${endpointPath}`;
  const reqHeaders = {
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
    ...headers,
  };
  if (token) {
    reqHeaders.Authorization = `Bearer ${token}`;
  }
  if (lastEventId) {
    reqHeaders['Last-Event-ID'] = lastEventId;
  }

  const abortController = new AbortController();
  const connectTimer = setTimeout(() => abortController.abort(), connectTimeoutMs);

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: reqHeaders,
      signal: abortController.signal,
    });
  } finally {
    clearTimeout(connectTimer);
  }

  const events = [];
  const waiters = [];

  const notifyWaiters = () => {
    for (let i = waiters.length - 1; i >= 0; i -= 1) {
      const waiter = waiters[i];
      const foundIdx = events.findIndex((evt, idx) => idx >= waiter.startIndex && waiter.predicate(evt));
      if (foundIdx !== -1) {
        waiters.splice(i, 1);
        clearTimeout(waiter.timer);
        waiter.resolve(events[foundIdx]);
      }
    }
  };

  let closed = false;
  let reader = null;
  let pumpPromise = Promise.resolve();

  if (response.ok && response.body) {
    reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    const dispatchFrame = (rawFrame) => {
      const lines = rawFrame.split(/\r?\n/);
      let eventName = 'message';
      let id = null;
      const dataLines = [];

      for (const line of lines) {
        if (!line || line.startsWith(':')) continue;
        const colonIdx = line.indexOf(':');
        const field = colonIdx === -1 ? line : line.slice(0, colonIdx);
        let value = colonIdx === -1 ? '' : line.slice(colonIdx + 1);
        if (value.startsWith(' ')) value = value.slice(1);

        if (field === 'event') eventName = value;
        else if (field === 'data') dataLines.push(value);
        else if (field === 'id') id = value;
      }

      if (dataLines.length === 0 && eventName === 'message') return;

      const rawData = dataLines.join('\n');
      let data = rawData;
      try {
        data = JSON.parse(rawData);
      } catch {
        // Keep raw string if not JSON
      }

      events.push({ event: eventName, id, data, rawData });
      notifyWaiters();
    };

    pumpPromise = (async () => {
      try {
        while (!closed) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split(/\r?\n\r?\n/);
          buffer = frames.pop() ?? '';
          for (const frame of frames) {
            if (frame.trim()) dispatchFrame(frame);
          }
        }
        if (buffer.trim()) {
          dispatchFrame(buffer);
        }
      } catch {
        // Expected on abort/close
      }
    })();
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    events,
    async waitForEvent(predicateOrName, timeoutMs = SSE_TIMEOUT_MS, startIndex = 0) {
      const predicate =
        typeof predicateOrName === 'string'
          ? (evt) => evt.event === predicateOrName
          : predicateOrName;

      const existing = events.slice(startIndex).find(predicate);
      if (existing) return existing;

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          const idx = waiters.indexOf(waiter);
          if (idx !== -1) waiters.splice(idx, 1);
          const summary = events.map((e) => `${e.event}:${typeof e.data === 'object' ? JSON.stringify(e.data) : e.rawData}`).join(' | ');
          reject(new Error(`Timed out after ${timeoutMs}ms waiting for SSE event. Received (${events.length}): [${summary}]`));
        }, timeoutMs);

        const waiter = { predicate, startIndex, resolve, timer };
        waiters.push(waiter);
      });
    },
    async close() {
      closed = true;
      abortController.abort();
      if (reader) {
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
      }
      await pumpPromise.catch(() => {});
    },
  };
}
