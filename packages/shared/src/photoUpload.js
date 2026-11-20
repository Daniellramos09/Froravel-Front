const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateProfileImageFile(file) {
  if (!file) {
    throw new Error('Selecione um arquivo de imagem.');
  }
  const type = String(file.type || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(type)) {
    throw new Error('Formato não suportado. Use JPEG, PNG ou WebP.');
  }
  if (!file.size || file.size < 1 || file.size > MAX_IMAGE_BYTES) {
    throw new Error('A imagem deve ter no máximo 5 MB.');
  }
}

export async function fetchCurrentUserProfile({ apiBase, token }) {
  if (!apiBase || !token) return null;
  const res = await fetch(`${apiBase}/api/usuarios/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfilePhotoUrl({ apiBase, fotoUrl, token }) {
  if (!apiBase || !token) {
    throw new Error('Sessão não autenticada para salvar foto.');
  }
  const res = await fetch(`${apiBase}/api/usuarios/me/foto`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fotoUrl }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.mensagem || 'Não foi possível salvar a foto no perfil.');
  }
  return res.json();
}

export async function uploadProfilePhoto({ apiBase, file, token }) {
  validateProfileImageFile(file);
  if (!apiBase || !token) {
    throw new Error('Sessão não autenticada para enviar foto.');
  }

  const presignRes = await fetch(`${apiBase}/api/usuarios/me/foto/presigned-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName: file.name || 'avatar.jpg',
      contentType: file.type,
      fileSizeBytes: file.size,
    }),
  });

  if (!presignRes.ok) {
    const errData = await presignRes.json().catch(() => ({}));
    throw new Error(errData.mensagem || 'Falha ao solicitar URL de upload.');
  }

  const presign = await presignRes.json();
  const putRes = await fetch(presign.uploadUrl, {
    method: presign.method || 'PUT',
    headers: presign.requiredHeaders || { 'Content-Type': file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error('Falha ao enviar a imagem para o armazenamento.');
  }

  const updated = await updateProfilePhotoUrl({
    apiBase,
    fotoUrl: presign.publicUrl,
    token,
  });

  return {
    ...presign,
    ...updated,
    fotoUrl: updated?.fotoUrl || presign.publicUrl,
  };
}
