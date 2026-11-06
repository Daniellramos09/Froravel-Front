// src/Screen/DashboardRh/screens/LicensesScreen.jsx
import { useState, useId, useEffect } from "react";
import {
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  SearchX,
  X,
  Send,
} from "lucide-react";

// Mock Data Inicial com conformidade LGPD (Somente dados cadastrais e status de convite)
const INITIAL_COLLABORATORS = [
  {
    id: "colab-1",
    name: "Camila Ribeiro de Souza",
    email: "camila.souza@techcorp.com.br",
    department: "Engenharia de Software",
    inviteDate: "12/09/2026",
    status: "active",
  },
  {
    id: "colab-2",
    name: "Juliana Mendes Freitas",
    email: "juliana.freitas@techcorp.com.br",
    department: "Design & UX",
    inviteDate: "18/09/2026",
    status: "active",
  },
  {
    id: "colab-3",
    name: "Fernanda Alcantara",
    email: "fernanda.alcantara@techcorp.com.br",
    department: "Operações & Logística",
    inviteDate: "02/10/2026",
    status: "pending",
  },
  {
    id: "colab-4",
    name: "Beatriz Nogueira Costa",
    email: "beatriz.costa@techcorp.com.br",
    department: "Marketing Corporativo",
    inviteDate: "28/08/2026",
    status: "active",
  },
  {
    id: "colab-5",
    name: "Mariana Vasconcelos",
    email: "mariana.v@techcorp.com.br",
    department: "Recursos Humanos",
    inviteDate: "15/10/2026",
    status: "pending",
  },
  {
    id: "colab-6",
    name: "Patrícia Diniz Ramos",
    email: "patricia.diniz@techcorp.com.br",
    department: "Vendas & Parcerias",
    inviteDate: "10/07/2026",
    status: "revoked",
  },
  {
    id: "colab-7",
    name: "Amanda Lima Prado",
    email: "amanda.prado@techcorp.com.br",
    department: "Engenharia de Dados",
    inviteDate: "05/10/2026",
    status: "active",
  },
  {
    id: "colab-8",
    name: "Carla Torres Silveira",
    email: "carla.torres@techcorp.com.br",
    department: "Finanças & Controladoria",
    inviteDate: "22/09/2026",
    status: "active",
  },
];

export default function LicensesScreen({ onTriggerToast }) {
  const [collaborators, setCollaborators] = useState(INITIAL_COLLABORATORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [localToast, setLocalToast] = useState(null);

  // Form State do Modal de Convite
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    department: "Engenharia de Software",
  });
  const [inviteError, setInviteError] = useState("");

  const searchInputId = useId();
  const statusSelectId = useId();
  const deptSelectId = useId();

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  // Filtragem
  const filteredCollaborators = collaborators.filter((colab) => {
    const matchesSearch =
      colab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colab.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || colab.status === statusFilter;
    const matchesDept =
      departmentFilter === "all" || colab.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Estatísticas calculadas para os Micro-Cards
  const totalAllocated = 50;
  const activeCount = collaborators.filter((c) => c.status === "active").length;
  const pendingCount = collaborators.filter((c) => c.status === "pending").length;
  const availableCount = Math.max(0, totalAllocated - activeCount - pendingCount);

  // Ações de Colaboradora
  const handleResendInvite = (colab) => {
    setActiveMenuId(null);
    triggerNotification(`Convite reenviado para ${colab.email}`);
  };

  const handleCopyLink = (colab) => {
    setActiveMenuId(null);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://floravel.com.br/convite?token=${colab.id}`);
    }
    triggerNotification("Link de ativação copiado!");
  };

  const handleRevoke = (colab) => {
    setActiveMenuId(null);
    setCollaborators((prev) =>
      prev.map((c) => (c.id === colab.id ? { ...c, status: "revoked" } : c))
    );
    triggerNotification(`Licença de ${colab.name} revogada.`);
  };

  const handleReactivate = (colab) => {
    setActiveMenuId(null);
    setCollaborators((prev) =>
      prev.map((c) => (c.id === colab.id ? { ...c, status: "active" } : c))
    );
    triggerNotification(`Licença de ${colab.name} reativada.`);
  };

  // Submissão de Novo Convite
  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      setInviteError("Preencha nome completo e e-mail.");
      return;
    }
    if (!inviteForm.email.includes("@")) {
      setInviteError("Informe um e-mail corporativo válido.");
      return;
    }

    const newColab = {
      id: `colab-${Date.now()}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim().toLowerCase(),
      department: inviteForm.department,
      inviteDate: new Date().toLocaleDateString("pt-BR"),
      status: "pending",
    };

    setCollaborators((prev) => [newColab, ...prev]);
    setIsInviteModalOpen(false);
    setInviteForm({ name: "", email: "", department: "Engenharia de Software" });
    setInviteError("");

    triggerNotification(`Convite enviado para ${newColab.email}`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
        setIsInviteModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-stone-800 animate-fadeIn">
      {/* Toast de Notificação */}
      {localToast && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#294D33] text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm border border-white/10 animate-fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{localToast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. HEADER ENXUTO (MINIMALISMO SAAS)                       */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between gap-4">
        <h1 
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Licenças
        </h1>

        <button
          type="button"
          onClick={() => {
            setInviteError("");
            setIsInviteModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#294D33] hover:bg-[#1e3a27] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 shrink-0"
          aria-haspopup="dialog"
        >
          <UserPlus size={16} aria-hidden="true" />
          <span>+ Convidar Colaboradora</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. KPIS EM MICRO-CARDS (COMPACTOS, SEM TEXTOS LONGOS)     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Micro-Card 1 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs">
          <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider block mb-0.5">
            Licenças Ativas
          </span>
          <div className="flex items-baseline gap-1.5">
            <span 
              className="text-2xl sm:text-3xl font-bold text-[#294D33]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {activeCount}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">/ {totalAllocated}</span>
          </div>
        </div>

        {/* Micro-Card 2 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs">
          <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider block mb-0.5">
            Convites Pendentes
          </span>
          <span 
            className="text-2xl sm:text-3xl font-bold text-amber-700"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {pendingCount}
          </span>
        </div>

        {/* Micro-Card 3 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs">
          <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider block mb-0.5">
            Vagas Disponíveis
          </span>
          <span 
            className="text-2xl sm:text-3xl font-bold text-[#516B55]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {availableCount}
          </span>
        </div>

        {/* Micro-Card 4 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs">
          <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider block mb-0.5">
            Taxa de Adesão
          </span>
          <div className="flex items-baseline gap-1.5">
            <span 
              className="text-2xl sm:text-3xl font-bold text-[#03543F]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              94%
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTROS E BUSCA DIRETA                                 */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-100 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar colaboradora
          </label>
          <Search 
            size={16} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" 
            aria-hidden="true" 
          />
          <input
            id={searchInputId}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            id={statusSelectId}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] cursor-pointer"
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativa</option>
            <option value="pending">Pendente</option>
            <option value="revoked">Revogada</option>
          </select>

          <select
            id={deptSelectId}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] cursor-pointer"
            aria-label="Filtrar por setor"
          >
            <option value="all">Todos os setores</option>
            <option value="Engenharia de Software">Engenharia</option>
            <option value="Design & UX">Design</option>
            <option value="Operações & Logística">Operações</option>
            <option value="Marketing Corporativo">Marketing</option>
            <option value="Recursos Humanos">RH</option>
            <option value="Vendas & Parcerias">Vendas</option>
            <option value="Finanças & Controladoria">Finanças</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. TABELA LIMPA (LINHAS FINAS, SEM FUNDO PESADO)           */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-2xs overflow-hidden">
        {filteredCollaborators.length === 0 ? (
          <div className="py-14 px-6 text-center max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FCF7F9] text-[#294D33] mx-auto flex items-center justify-center">
              <SearchX size={24} aria-hidden="true" />
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Nenhuma colaboradora encontrada para os filtros atuais.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDepartmentFilter("all");
              }}
              className="text-xs font-bold text-[#294D33] hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <caption className="sr-only">Tabela de licenças ativas e convites</caption>
              <thead>
                <tr className="border-b border-stone-100 text-[#516B55] text-[11px] font-bold uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">
                    Colaboradora
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Departamento
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Data Convite
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredCollaborators.map((colab) => {
                  const isMenuOpen = activeMenuId === colab.id;

                  return (
                    <tr 
                      key={colab.id} 
                      className="hover:bg-[#FCF7F9]/50 transition-colors"
                    >
                      {/* Nome / Email */}
                      <td className="py-3 px-4 sm:px-6">
                        <p className="font-semibold text-stone-900 leading-tight">
                          {colab.name}
                        </p>
                        <span className="text-[#516B55] text-[11px]">
                          {colab.email}
                        </span>
                      </td>

                      {/* Departamento */}
                      <td className="py-3 px-4 text-stone-600 text-xs">
                        {colab.department}
                      </td>

                      {/* Data */}
                      <td className="py-3 px-4 text-stone-400 font-mono text-xs">
                        {colab.inviteDate}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {colab.status === "active" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DEF7EC] text-[#03543F]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                            Ativa
                          </span>
                        )}
                        {colab.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/50">
                            <Clock size={11} aria-hidden="true" />
                            Pendente
                          </span>
                        )}
                        {colab.status === "revoked" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-500">
                            <Ban size={11} aria-hidden="true" />
                            Revogada
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : colab.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#294D33]"
                          aria-label={`Ações para ${colab.name}`}
                          aria-expanded={isMenuOpen}
                        >
                          <MoreVertical size={15} />
                        </button>

                        {isMenuOpen && (
                          <div 
                            role="menu"
                            className="absolute right-4 top-10 z-30 w-44 rounded-xl bg-white border border-stone-200 shadow-lg py-1 text-xs text-left animate-fade-in"
                          >
                            <button
                              type="button"
                              onClick={() => handleResendInvite(colab)}
                              className="w-full px-3 py-2 text-stone-700 hover:bg-[#FCF7F9] flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <Mail size={13} className="text-[#516B55]" />
                              <span>Reenviar Convite</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(colab)}
                              className="w-full px-3 py-2 text-stone-700 hover:bg-[#FCF7F9] flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <Copy size={13} className="text-stone-400" />
                              <span>Copiar Link</span>
                            </button>
                            <div className="my-1 border-t border-stone-100" />
                            {colab.status === "revoked" ? (
                              <button
                                type="button"
                                onClick={() => handleReactivate(colab)}
                                className="w-full px-3 py-2 text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                <span>Reativar</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRevoke(colab)}
                                className="w-full px-3 py-2 text-[#9B1C1C] hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <Trash2 size={13} />
                                <span>Revogar</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL DE CONVITE                                          */}
      {/* ========================================================= */}
      {isInviteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsInviteModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-stone-100 relative text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

            <h3 
              className="text-lg font-bold text-[#294D33] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Convidar Colaboradora
            </h3>
            <p className="text-xs text-[#516B55] mb-4">
              Envie o acesso confidencial ao programa Florável.
            </p>

            {inviteError && (
              <div className="mb-3 p-2.5 rounded-xl bg-[#FDE8E8] text-xs text-[#9B1C1C] font-semibold">
                {inviteError}
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="Mariana Silva"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="mariana.silva@techcorp.com.br"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Departamento
                </label>
                <select
                  value={inviteForm.department}
                  onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white"
                >
                  <option value="Engenharia de Software">Engenharia de Software</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Operações & Logística">Operações & Logística</option>
                  <option value="Marketing Corporativo">Marketing Corporativo</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Vendas & Parcerias">Vendas & Parcerias</option>
                  <option value="Finanças & Controladoria">Finanças & Controladoria</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#294D33] hover:bg-[#1e3c27] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Send size={13} aria-hidden="true" />
                  <span>Disparar Convite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
