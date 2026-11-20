import { useState, useId, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
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
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { APP_LINKS } from "../utils/appLinks";
import {
  obterEmpresaAtual,
  listarLicencas,
  obterRelatorioKAnonimato,
  emitirConviteLicenca,
  reenviarConviteLicenca,
  revogarLicenca,
  reativarLicenca,
  RhApiError,
} from "../services/rhApi";

const DEFAULT_DEPARTMENTS = [
  "Engenharia",
  "Jurídico",
  "Design",
  "Engenharia de Software",
  "Design & UX",
  "Operações & Logística",
  "Marketing Corporativo",
  "Recursos Humanos",
  "Vendas & Parcerias",
  "Finanças & Controladoria",
];

function normalizeStatus(status) {
  const s = String(status || "").toUpperCase();
  if (s === "ATIVADA" || s === "ACTIVE") return "ATIVADA";
  if (s === "REVOGADA" || s === "REVOKED") return "REVOGADA";
  return "PENDENTE";
}

function formatDatePtBr(rawDate) {
  if (!rawDate) return "—";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return String(rawDate);
  }
  return parsed.toLocaleDateString("pt-BR");
}

export default function LicensesScreen({
  empresaId: propEmpresaId,
  licenses: propLicenses,
  relatorio: propRelatorio,
  parentLoading = false,
  parentError = null,
  onRetry,
  onLicensesUpdated,
  onTriggerToast,
}) {
  const isControlledByParent = propLicenses !== undefined && Boolean(propEmpresaId);

  const [localEmpresaId, setLocalEmpresaId] = useState(propEmpresaId || "");
  const [localLicenses, setLocalLicenses] = useState(propLicenses || []);
  const [localRelatorio, setLocalRelatorio] = useState(propRelatorio || null);
  const [standaloneLoading, setStandaloneLoading] = useState(!isControlledByParent);
  const [standaloneError, setStandaloneError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [localToast, setLocalToast] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    nomeColaboradora: "",
    emailCorporativo: "",
    departamento: "Engenharia",
  });
  const [inviteError, setInviteError] = useState("");

  const searchInputId = useId();
  const statusSelectId = useId();
  const deptSelectId = useId();

  const loadStandalonePayload = useCallback(async () => {
    let targetEmpresaId = propEmpresaId;
    if (!targetEmpresaId) {
      const emp = await obterEmpresaAtual();
      targetEmpresaId = emp.id;
    }
    const [list, rel] = await Promise.all([
      listarLicencas(targetEmpresaId),
      obterRelatorioKAnonimato(targetEmpresaId),
    ]);
    return {
      targetEmpresaId,
      list: Array.isArray(list) ? list : [],
      rel,
    };
  }, [propEmpresaId]);

  const fetchStandaloneData = useCallback(async () => {
    setStandaloneLoading(true);
    setStandaloneError(null);
    try {
      const { targetEmpresaId, list, rel } = await loadStandalonePayload();
      setLocalEmpresaId(targetEmpresaId);
      setLocalLicenses(list);
      setLocalRelatorio(rel);
    } catch (err) {
      setStandaloneError(
        err instanceof RhApiError
          ? err.message
          : "Não foi possível carregar as licenças corporativas."
      );
    } finally {
      setStandaloneLoading(false);
    }
  }, [loadStandalonePayload]);

  useEffect(() => {
    if (isControlledByParent) return undefined;
    let active = true;
    loadStandalonePayload()
      .then(({ targetEmpresaId, list, rel }) => {
        if (!active) return;
        setLocalEmpresaId(targetEmpresaId);
        setLocalLicenses(list);
        setLocalRelatorio(rel);
        setStandaloneError(null);
      })
      .catch((err) => {
        if (!active) return;
        setStandaloneError(
          err instanceof RhApiError
            ? err.message
            : "Não foi possível carregar as licenças corporativas."
        );
      })
      .finally(() => {
        if (active) setStandaloneLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isControlledByParent, loadStandalonePayload]);

  const effectiveEmpresaId = propEmpresaId || localEmpresaId;
  const licenses = propLicenses !== undefined ? propLicenses : localLicenses;
  const relatorio = propRelatorio !== undefined ? propRelatorio : localRelatorio;
  const loading = isControlledByParent ? parentLoading : standaloneLoading;
  const errorMessage = isControlledByParent ? parentError?.message : standaloneError;

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  const departmentOptions = useMemo(() => {
    const set = new Set(DEFAULT_DEPARTMENTS);
    for (const item of licenses) {
      if (item?.departamento) set.add(item.departamento);
    }
    return Array.from(set);
  }, [licenses]);

  const filteredCollaborators = licenses.filter((colab) => {
    const name = (colab.nomeColaboradora || "").toLowerCase();
    const email = (colab.emailCorporativo || "").toLowerCase();
    const status = normalizeStatus(colab.status);
    const term = searchTerm.toLowerCase();

    const matchesSearch = name.includes(term) || email.includes(term);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesDept =
      departmentFilter === "all" || colab.departamento === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const activeCount = licenses.filter((c) => normalizeStatus(c.status) === "ATIVADA").length;
  const pendingCount = licenses.filter((c) => normalizeStatus(c.status) === "PENDENTE").length;
  const revokedCount = licenses.filter((c) => normalizeStatus(c.status) === "REVOGADA").length;
  const totalCount = licenses.length;
  const adherenceRate =
    relatorio?.taxaAdesaoPercentual ??
    (totalCount > 0 ? Math.round((activeCount / totalCount) * 1000) / 10 : 0);

  const syncUpdatedLicense = async (updated) => {
    setLocalLicenses((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    if (onLicensesUpdated) {
      await onLicensesUpdated();
    } else if (effectiveEmpresaId) {
      const rel = await obterRelatorioKAnonimato(effectiveEmpresaId).catch(() => null);
      if (rel) setLocalRelatorio(rel);
    }
  };

  const handleResendInvite = async (colab) => {
    setActiveMenuId(null);
    setBusyId(colab.id);
    try {
      const updated = await reenviarConviteLicenca(colab.id);
      await syncUpdatedLicense(updated);
      triggerNotification(`Convite reenviado para ${colab.emailCorporativo}`);
    } catch (err) {
      triggerNotification(
        err instanceof RhApiError ? err.message : "Erro ao reenviar convite."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleCopyLink = async (colab) => {
    setActiveMenuId(null);
    const token = colab.tokenConvite || "";
    const inviteUrl = `${APP_LINKS.landing}/cadastro?perfil=mae&convite=${encodeURIComponent(token)}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteUrl);
    }
    triggerNotification("Link de ativação copiado!");
  };

  const handleRevoke = async (colab) => {
    setActiveMenuId(null);
    setBusyId(colab.id);
    try {
      const updated = await revogarLicenca(colab.id);
      await syncUpdatedLicense(updated);
      triggerNotification(`Licença de ${colab.nomeColaboradora} revogada.`);
    } catch (err) {
      triggerNotification(
        err instanceof RhApiError ? err.message : "Erro ao revogar licença."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (colab) => {
    setActiveMenuId(null);
    setBusyId(colab.id);
    try {
      const updated = await reativarLicenca(colab.id);
      await syncUpdatedLicense(updated);
      triggerNotification(`Licença de ${colab.nomeColaboradora} reativada.`);
    } catch (err) {
      triggerNotification(
        err instanceof RhApiError ? err.message : "Erro ao reativar licença."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.nomeColaboradora.trim() || !inviteForm.emailCorporativo.trim()) {
      setInviteError("Preencha nome completo e e-mail.");
      return;
    }
    if (!inviteForm.emailCorporativo.includes("@")) {
      setInviteError("Informe um e-mail corporativo válido.");
      return;
    }
    if (!effectiveEmpresaId) {
      setInviteError("Empresa corporativa não identificada.");
      return;
    }

    setIsSubmittingInvite(true);
    setInviteError("");
    try {
      const created = await emitirConviteLicenca({
        empresaId: effectiveEmpresaId,
        nomeColaboradora: inviteForm.nomeColaboradora.trim(),
        emailCorporativo: inviteForm.emailCorporativo.trim().toLowerCase(),
        departamento: inviteForm.departamento.trim(),
      });
      setLocalLicenses((prev) => [created, ...prev]);
      if (onLicensesUpdated) {
        await onLicensesUpdated();
      } else {
        const rel = await obterRelatorioKAnonimato(effectiveEmpresaId).catch(() => null);
        if (rel) setLocalRelatorio(rel);
      }
      setIsInviteModalOpen(false);
      setInviteForm({
        nomeColaboradora: "",
        emailCorporativo: "",
        departamento: "Engenharia",
      });
      triggerNotification(`Convite enviado para ${created.emailCorporativo}`);
    } catch (err) {
      setInviteError(
        err instanceof RhApiError
          ? err.message
          : "Não foi possível emitir o convite corporativo."
      );
    } finally {
      setIsSubmittingInvite(false);
    }
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

      {/* HEADER */}
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
          disabled={!effectiveEmpresaId || loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#294D33] hover:bg-[#1e3a27] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 shrink-0"
          aria-haspopup="dialog"
        >
          <UserPlus size={16} aria-hidden="true" />
          <span>+ Convidar Colaboradora</span>
        </button>
      </div>

      {loading && (
        <div
          data-testid="licenses-loading"
          aria-busy="true"
          className="space-y-4 animate-pulse"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-20 bg-white rounded-2xl border border-stone-100 p-4" />
            ))}
          </div>
          <div className="h-48 bg-white rounded-2xl border border-stone-100" />
        </div>
      )}

      {!loading && errorMessage && (
        <div
          role="alert"
          data-testid="licenses-error"
          className="bg-white border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-[#9B1C1C] font-medium">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => (onRetry ? onRetry() : fetchStandaloneData())}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tentar novamente</span>
          </button>
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          {/* KPIS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
                <span className="text-[11px] text-stone-400 font-medium">/ {totalCount}</span>
              </div>
            </div>

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

            <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs">
              <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider block mb-0.5">
                Licenças Revogadas
              </span>
              <span
                className="text-2xl sm:text-3xl font-bold text-[#516B55]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {revokedCount}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs">
              <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider block mb-0.5">
                Taxa de Adesão
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-2xl sm:text-3xl font-bold text-[#03543F]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {adherenceRate}%
                </span>
              </div>
            </div>
          </div>

          {/* FILTROS */}
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
                <option value="ATIVADA">Ativa</option>
                <option value="PENDENTE">Pendente</option>
                <option value="REVOGADA">Revogada</option>
              </select>

              <select
                id={deptSelectId}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] cursor-pointer"
                aria-label="Filtrar por setor"
              >
                <option value="all">Todos os setores</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABELA */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-2xs overflow-visible">
            {filteredCollaborators.length === 0 ? (
              <div className="py-14 px-6 text-center max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FCF7F9] text-[#294D33] mx-auto flex items-center justify-center">
                  <SearchX size={24} aria-hidden="true" />
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {licenses.length === 0
                    ? "Nenhuma licença emitida para esta empresa ainda."
                    : "Nenhuma colaboradora encontrada para os filtros atuais."}
                </p>
                {(searchTerm || statusFilter !== "all" || departmentFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDepartmentFilter("all");
                    }}
                    className="text-xs font-bold text-[#294D33] hover:underline cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
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
                      const status = normalizeStatus(colab.status);
                      const isRowBusy = busyId === colab.id;

                      return (
                        <tr
                          key={colab.id}
                          className="hover:bg-[#FCF7F9]/50 transition-colors"
                        >
                          <td className="py-3 px-4 sm:px-6">
                            <p className="font-semibold text-stone-900 leading-tight">
                              {colab.nomeColaboradora}
                            </p>
                            <span className="text-[#516B55] text-[11px]">
                              {colab.emailCorporativo}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-stone-600 text-xs">
                            {colab.departamento}
                          </td>

                          <td className="py-3 px-4 text-stone-400 font-mono text-xs">
                            {formatDatePtBr(colab.dataConvite)}
                          </td>

                          <td className="py-3 px-4">
                            {status === "ATIVADA" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DEF7EC] text-[#03543F]">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-emerald-600"
                                  aria-hidden="true"
                                />
                                Ativa
                              </span>
                            )}
                            {status === "PENDENTE" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/50">
                                <Clock size={11} aria-hidden="true" />
                                Pendente
                              </span>
                            )}
                            {status === "REVOGADA" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-500">
                                <Ban size={11} aria-hidden="true" />
                                Revogada
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right relative">
                            <button
                              type="button"
                              disabled={isRowBusy}
                              onClick={() => setActiveMenuId(isMenuOpen ? null : colab.id)}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-[#294D33]"
                              aria-label={`Ações para ${colab.nomeColaboradora}`}
                              aria-expanded={isMenuOpen}
                            >
                              <MoreVertical size={15} />
                            </button>

                            {isMenuOpen && (
                              <div
                                role="menu"
                                className="absolute right-4 top-10 z-30 w-44 rounded-xl bg-white border border-stone-200 shadow-lg py-1 text-xs text-left animate-fade-in"
                              >
                                {status === "PENDENTE" && (
                                  <button
                                    type="button"
                                    onClick={() => handleResendInvite(colab)}
                                    className="w-full px-3 py-2 text-stone-700 hover:bg-[#FCF7F9] flex items-center gap-2 cursor-pointer font-medium"
                                  >
                                    <Mail size={13} className="text-[#516B55]" />
                                    <span>Reenviar Convite</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleCopyLink(colab)}
                                  className="w-full px-3 py-2 text-stone-700 hover:bg-[#FCF7F9] flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Copy size={13} className="text-stone-400" />
                                  <span>Copiar Link</span>
                                </button>
                                <div className="my-1 border-t border-stone-100" />
                                {status === "REVOGADA" ? (
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
        </>
      )}

      {/* MODAL DE CONVITE */}
      {isInviteModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1F3A27]/30 backdrop-blur-sm animate-fadeIn font-sans"
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
                <div
                  role="alert"
                  className="mb-3 p-2.5 rounded-xl bg-[#FDE8E8] text-xs text-[#9B1C1C] font-semibold"
                >
                  {inviteError}
                </div>
              )}

              <form onSubmit={handleSendInvite} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="invite-name"
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="invite-name"
                    type="text"
                    required
                    value={inviteForm.nomeColaboradora}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, nomeColaboradora: e.target.value })
                    }
                    placeholder="Mariana Silva"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invite-email"
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                  >
                    E-mail Corporativo
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    required
                    value={inviteForm.emailCorporativo}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, emailCorporativo: e.target.value })
                    }
                    placeholder="colaboradora@empresa.com.br"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invite-department"
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                  >
                    Departamento
                  </label>
                  <select
                    id="invite-department"
                    value={inviteForm.departamento}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, departamento: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white"
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingInvite}
                    className="px-5 py-2 rounded-full bg-[#294D33] hover:bg-[#1e3c27] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={13} aria-hidden="true" />
                    <span>{isSubmittingInvite ? "Enviando..." : "Disparar Convite"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
