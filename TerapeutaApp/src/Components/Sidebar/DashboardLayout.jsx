import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import InstallAppButton from '../Pwa/InstallAppButton';

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f9f2f2]">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra superior do celular: dá acesso ao menu, que no computador fica fixo ao lado */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 h-14 px-3 bg-white border-b border-[#f0e4e4]">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
              className="p-2 rounded-xl border border-[#f0e4e4] text-[#9b4f55] cursor-pointer active:scale-95"
            >
              <Menu size={20} />
            </button>
            <img src="/img/fotoheader/logo.png" alt="" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold text-[#9b4f55] tracking-tight">florável</span>
          </div>
          <InstallAppButton className="p-2.5 sm:px-4 bg-[#9b4f55] text-white hover:bg-[#843f45]" />
        </header>

        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 sm:py-8 md:px-14 md:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
