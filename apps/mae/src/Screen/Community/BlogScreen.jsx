import React from 'react';

export default function BlogScreen() {
  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Título Superior da Página */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-52"></div>
      </div>

      {/* Lista de Artigos / Posts do Blog (3 linhas com Imagem + Texto) */}
      <div className="space-y-6">
        {[1, 2, 3].map((post) => (
          <div key={post} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Bloco de Imagem com o "X" simulado */}
            <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <svg className="w-10 h-10 text-gray-300 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            {/* Linhas de texto simuladas correspondentes ao post */}
            <div className="flex-1 space-y-3 w-full">
              <div className="h-3.5 bg-gray-300 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}