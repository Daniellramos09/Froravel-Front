const isLocal =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

// Endereço da landing page, usado no botão "Portal Principal"
export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL || (isLocal ? 'http://localhost:5173' : 'https://froravel-lading.vercel.app');
