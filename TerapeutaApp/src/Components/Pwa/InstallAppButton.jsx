// Botão "Instalar app". Só aparece quando a instalação é possível e o app ainda não está instalado.
// Android/Chrome/Edge: abre o pedido de instalação do navegador.
// iPhone/iPad: não existe esse pedido, então mostra o passo a passo.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share, SquarePlus, X } from 'lucide-react';

// Fora do componente: o navegador pode avisar antes de o botão aparecer na tela
let installEvent = null;
const subscribers = new Set();
const notify = () => subscribers.forEach((fn) => fn(installEvent));

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installEvent = e;
  notify();
});
window.addEventListener('appinstalled', () => {
  installEvent = null;
  notify();
});

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export default function InstallAppButton({ className = '' }) {
  const [promptEvent, setPromptEvent] = useState(installEvent);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    subscribers.add(setPromptEvent);
    return () => subscribers.delete(setPromptEvent);
  }, []);

  if (isStandalone() || (!promptEvent && !isIOS())) return null;

  const handleClick = async () => {
    if (!promptEvent) {
      setShowIosHelp(true);
      return;
    }
    promptEvent.prompt();
    await promptEvent.userChoice;
    // O navegador só permite usar cada pedido uma vez
    installEvent = null;
    notify();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Instalar o app neste aparelho"
        aria-label="Instalar app"
        className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition cursor-pointer active:scale-95 ${className}`}
      >
        <Download size={18} />
        <span className="hidden sm:inline text-[13px] whitespace-nowrap">Instalar app</span>
      </button>

      {showIosHelp &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/40"
            onClick={() => setShowIosHelp(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ios-install-title"
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-left text-[#294D33]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowIosHelp(false)}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-1.5 rounded-full text-stone-500 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
              <h3 id="ios-install-title" className="text-lg font-bold mb-4">
                Instalar no iPhone
              </h3>
              <ol className="space-y-3 text-sm text-stone-700">
                <li className="flex items-center gap-3">
                  <Share size={20} className="text-[#294D33] shrink-0" />
                  <span>
                    1. Toque em <strong>Compartilhar</strong> no navegador
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <SquarePlus size={20} className="text-[#294D33] shrink-0" />
                  <span>
                    2. Escolha <strong>Adicionar à Tela de Início</strong>
                  </span>
                </li>
              </ol>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
