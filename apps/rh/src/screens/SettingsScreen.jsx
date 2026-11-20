import { useState, useId, useRef, useEffect, useCallback } from "react";
import {
  Building2,
  Users,
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Save,
  Sparkles,
  RefreshCw,
  Info,
  LogIn,
} from "lucide-react";
import {
  obterEmpresaAtual,
  atualizarEmpresa,
  RhApiError,
} from "../services/rhApi";
import { getInitials } from "../utils/rhSession";

const CNPJ_REGEX = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/;
const CNPJ_ERROR_MESSAGE =
  "CNPJ inválido. Informe 14 dígitos ou o formato XX.XXX.XXX/XXXX-XX.";

export default function SettingsScreen({
  company: propCompany,
  session = null,
  parentLoading = false,
  parentError = null,
  onRetry,
  onLogout,
  onCompanyUpdated,
  onTriggerToast,
}) {
  const isControlledByParent = propCompany !== undefined;

  const [activeTab, setActiveTab] = useState("company");
  const [localCompany, setLocalCompany] = useState(propCompany || null);
  const [standaloneLoading, setStandaloneLoading] = useState(!isControlledByParent);
  const [standaloneError, setStandaloneError] = useState(null);

  const [draftForm, setDraftForm] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [localToast, setLocalToast] = useState(null);

  const companyNameId = useId();
  const cnpjId = useId();
  const tabListRef = useRef(null);
  const savingRef = useRef(false);

  const fetchCompany = useCallback(async () => {
    setStandaloneLoading(true);
    setStandaloneError(null);
    try {
      const emp = await obterEmpresaAtual();
      setLocalCompany(emp);
      setDraftForm(null);
      setValidationErrors({});
      setSaveError("");
    } catch (err) {
      setStandaloneError(
        err instanceof RhApiError
          ? { message: err.message, isAuthError: err.isAuthError }
          : {
              message: "Não foi possível carregar os dados da empresa.",
              isAuthError: false,
            }
      );
    } finally {
      setStandaloneLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isControlledByParent) return undefined;
    let active = true;
    obterEmpresaAtual()
      .then((emp) => {
        if (!active) return;
        setLocalCompany(emp);
        setDraftForm(null);
        setValidationErrors({});
        setSaveError("");
        setStandaloneError(null);
      })
      .catch((err) => {
        if (!active) return;
        setStandaloneError(
          err instanceof RhApiError
            ? { message: err.message, isAuthError: err.isAuthError }
            : {
                message: "Não foi possível carregar os dados da empresa.",
                isAuthError: false,
              }
        );
      })
      .finally(() => {
        if (active) setStandaloneLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isControlledByParent]);

  const company = propCompany || localCompany;
  const companyForm = draftForm ?? {
    nome: company?.nome || "",
    cnpj: company?.cnpj || "",
  };
  const isModified = draftForm !== null;
  const loading = isControlledByParent ? parentLoading : standaloneLoading;
  const rawError = isControlledByParent ? parentError : standaloneError;
  const activeError =
    typeof rawError === "string" ? { message: rawError, isAuthError: false } : rawError;
  const loadError = activeError?.message || null;

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  const handleCompanyChange = (field, value) => {
    setSaveError("");
    setDraftForm((prev) => ({
      ...(prev ?? { nome: company?.nome || "", cnpj: company?.cnpj || "" }),
      [field]: value,
    }));

    const errors = { ...validationErrors };
    if (field === "nome") {
      if (!value.trim()) {
        errors.nome = "O nome da empresa é obrigatório.";
      } else {
        delete errors.nome;
      }
    }
    if (field === "cnpj") {
      if (!CNPJ_REGEX.test(value.trim())) {
        errors.cnpj = CNPJ_ERROR_MESSAGE;
      } else {
        delete errors.cnpj;
      }
    }
    setValidationErrors(errors);
  };

  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    if (savingRef.current) return;
    if (!company?.id || Object.keys(validationErrors).length > 0 || !isModified) return;

    const trimmedName = companyForm.nome.trim();
    const trimmedCnpj = companyForm.cnpj.trim();
    const isCnpjValid = CNPJ_REGEX.test(trimmedCnpj);
    if (!trimmedName || !isCnpjValid) {
      setValidationErrors({
        ...(trimmedName ? {} : { nome: "O nome da empresa é obrigatório." }),
        ...(isCnpjValid ? {} : { cnpj: CNPJ_ERROR_MESSAGE }),
      });
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setSaveError("");
    try {
      const updated = await atualizarEmpresa(company.id, {
        nome: trimmedName,
        cnpj: trimmedCnpj,
      });
      setLocalCompany(updated);
      setDraftForm(null);
      setValidationErrors({});
      if (onCompanyUpdated) {
        onCompanyUpdated(updated);
      }
      triggerNotification("Dados da empresa atualizados com sucesso!");
    } catch (err) {
      setSaveError(
        err instanceof RhApiError
          ? err.message
          : "Não foi possível salvar os dados da empresa."
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const tabsList = [
    { id: "company", label: "Perfil da Empresa", icon: Building2 },
    { id: "admins", label: "Administradores", icon: Users },
    { id: "notifications", label: "Notificações", icon: Bell },
  ];

  const handleTabKeyDown = (e, currentIndex) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabsList[(currentIndex + 1) % tabsList.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabsList[(currentIndex - 1 + tabsList.length) % tabsList.length].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(tabsList[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(tabsList[tabsList.length - 1].id);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans antialiased text-stone-800">
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

      <div>
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Configurações Corporativas
        </h2>
        <p className="text-xs sm:text-sm text-[#516B55] mt-1">
          Gerencie os dados cadastrais de {company?.nome || "sua organização"} e visualize as informações da conta RH.
        </p>
      </div>

      {/* TABS */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Abas de configurações corporativas"
        className="flex items-center gap-2 border-b border-stone-200 pb-px"
      >
        {tabsList.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
                isActive
                  ? "border-[#294D33] text-[#294D33]"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div
          data-testid="settings-loading"
          aria-busy="true"
          className="h-56 bg-white rounded-2xl border border-stone-100 animate-pulse"
        />
      )}

      {!loading && loadError && (
        <div
          role="alert"
          data-testid="settings-error"
          className="bg-white border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-[#9B1C1C] font-medium">{loadError}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activeError?.isAuthError && onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#294D33] text-white text-xs font-bold hover:bg-[#1e3a27] transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Fazer login novamente</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => (onRetry ? onRetry() : fetchCompany())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      )}

      {/* ABA 1: PERFIL DA EMPRESA */}
      {!loading && !loadError && activeTab === "company" && company && (
        <section
          role="tabpanel"
          id="panel-company"
          aria-labelledby="tab-company"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm space-y-6"
        >
          <div className="border-b border-stone-100 pb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3
                className="text-base font-bold text-[#294D33]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Dados Cadastrais da Empresa
              </h3>
              <p className="text-xs text-[#516B55]">
                As informações abaixo identificam a sua organização nos relatórios de K-Anonimato.
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#DEF7EC] text-[#03543F]">
              Status: {company.status}
            </span>
          </div>

          {saveError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-[#FDE8E8] border border-red-200 text-xs text-[#9B1C1C] font-semibold flex items-center gap-2"
            >
              <AlertCircle size={15} aria-hidden="true" />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveChanges} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={companyNameId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  Razão Social / Nome da Empresa
                </label>
                <input
                  id={companyNameId}
                  type="text"
                  required
                  value={companyForm.nome}
                  onChange={(e) => handleCompanyChange("nome", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition"
                />
                {validationErrors.nome && (
                  <p role="alert" className="mt-1.5 text-xs text-[#9B1C1C] font-semibold">
                    {validationErrors.nome}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={cnpjId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  CNPJ
                </label>
                <input
                  id={cnpjId}
                  type="text"
                  required
                  value={companyForm.cnpj}
                  onChange={(e) => handleCompanyChange("cnpj", e.target.value)}
                  aria-invalid={!!validationErrors.cnpj}
                  aria-describedby={validationErrors.cnpj ? "cnpj-error" : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition ${
                    validationErrors.cnpj
                      ? "border-red-400 bg-[#FDE8E8]/30 text-[#9B1C1C]"
                      : "border-stone-200 text-stone-800"
                  }`}
                />
                {validationErrors.cnpj && (
                  <p
                    id="cnpj-error"
                    role="alert"
                    aria-live="polite"
                    className="mt-1.5 text-xs text-[#9B1C1C] flex items-center gap-1 font-semibold"
                  >
                    <AlertCircle size={13} aria-hidden="true" />
                    <span>{validationErrors.cnpj}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FCF7F9] border border-[#F4C4D4]/40 flex items-center justify-between flex-wrap gap-3 text-xs text-[#516B55]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-[#294D33] shrink-0" aria-hidden="true" />
                <span>
                  Identificador corporativo: <strong className="font-mono">{company.id}</strong>
                </span>
              </div>
              {company.dataCadastro && (
                <span>Cadastro em {new Date(company.dataCadastro).toLocaleDateString("pt-BR")}</span>
              )}
            </div>

            <div className="bg-white/95 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-600">
                {isModified ? (
                  <span className="text-[#294D33] font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#516B55]" />
                    Você possui alterações pendentes para salvar.
                  </span>
                ) : (
                  <span className="text-stone-400">
                    Dados sincronizados com o servidor.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {isModified && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftForm(null);
                      setValidationErrors({});
                      setSaveError("");
                    }}
                    className="px-4 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition cursor-pointer"
                  >
                    Descartar
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!isModified || Object.keys(validationErrors).length > 0 || isSaving}
                  className={`w-full sm:w-auto px-7 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
                    isModified && Object.keys(validationErrors).length === 0
                      ? "bg-[#294D33] hover:bg-[#1f3a27] text-white shadow-md cursor-pointer"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-white" aria-hidden="true" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} aria-hidden="true" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* ABA 2: ADMINISTRADORES (SAFE FALLBACK) */}
      {!loading && !loadError && activeTab === "admins" && (
        <section
          role="tabpanel"
          id="panel-admins"
          aria-labelledby="tab-admins"
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-xs flex items-center justify-center border border-[#E8A9BB]/40 shrink-0">
                {getInitials(session?.nome || company?.nome || "RH")}
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {session?.nome || "Gestor RH Autenticado"}
                </h3>
                <p className="text-xs text-[#516B55]">{session?.email || "Conta corporativa RH"}</p>
                {session?.codigoPublico && (
                  <span className="inline-block mt-1 text-[11px] font-mono text-stone-500">
                    Código público: {session.codigoPublico}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FCF7F9] border border-stone-200/80 flex items-start gap-3 text-xs text-[#516B55]">
              <Info size={18} className="text-[#294D33] shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                O provisionamento multi-administrador via API está indisponível nesta versão. Somente o gestor autenticado vinculado à empresa possui acesso administrativo ativo.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ABA 3: NOTIFICAÇÕES (SAFE FALLBACK) */}
      {!loading && !loadError && activeTab === "notifications" && (
        <section
          role="tabpanel"
          id="panel-notifications"
          aria-labelledby="tab-notifications"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm space-y-4"
        >
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-[#294D33] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3
                className="text-base font-bold text-[#294D33]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Preferências de Notificação Indisponíveis
              </h3>
              <p className="text-xs text-[#516B55] mt-1 leading-relaxed">
                A persistência remota de preferências de alertas corporativos ainda não está conectada a um endpoint de notificações neste ambiente. Nenhum alerta fictício é simulado.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
