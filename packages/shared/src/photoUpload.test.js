import { describe, it, expect, vi, afterEach } from 'vitest';
import { uploadProfilePhoto, validateProfileImageFile } from './photoUpload.js';

describe('@floravel/shared M4 photoUpload helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('valida MIME permitido e limite de 5 MB', () => {
    expect(() =>
      validateProfileImageFile({ type: 'application/pdf', size: 1024, name: 'doc.pdf' })
    ).toThrow(/JPEG, PNG ou WebP/);

    expect(() =>
      validateProfileImageFile({ type: 'image/jpeg', size: 6 * 1024 * 1024, name: 'big.jpg' })
    ).toThrow(/5 MB/);

    expect(() =>
      validateProfileImageFile({ type: 'image/webp', size: 2048, name: 'ok.webp' })
    ).not.toThrow();
  });

  it('executa fluxo presigned-url -> PUT -> PATCH /api/usuarios/me/foto', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: 'https://r2.example.invalid/upload-signed',
          publicUrl: 'https://cdn.floravel.test/perfis/u1/avatar.png',
          method: 'PUT',
          requiredHeaders: { 'Content-Type': 'image/png' },
        }),
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          usuarioId: 'u1',
          fotoUrl: 'https://cdn.floravel.test/perfis/u1/avatar.png',
          mensagem: 'ok',
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const file = { name: 'avatar.png', type: 'image/png', size: 1024 };
    const result = await uploadProfilePhoto({
      apiBase: 'http://localhost:8080',
      file,
      token: 'jwt-123',
    });

    expect(result.fotoUrl).toBe('https://cdn.floravel.test/perfis/u1/avatar.png');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/usuarios/me/foto/presigned-url');
    expect(fetchMock.mock.calls[1][0]).toBe('https://r2.example.invalid/upload-signed');
    expect(fetchMock.mock.calls[1][1].method).toBe('PUT');
    expect(fetchMock.mock.calls[2][0]).toBe('http://localhost:8080/api/usuarios/me/foto');
    expect(fetchMock.mock.calls[2][1].method).toBe('PATCH');
  });
});
