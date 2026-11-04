// src/Screen/DashboardRh/screens/SettingsScreen.jsx
import React, { useState, useId, useRef } from "react";
import {
  Settings,
  Building2,
  Users,
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  Phone,
  FileBadge,
  Sparkles,
  RefreshCw,
} from "lucide-react";

// Administradores iniciais da empresa
const INITIAL_ADMINS = [
  {
    id: "admin-1",
    name: "Tatiana Camargo",
    email: "tatiana.camargo@techcorp.com.br",
    role: "Administradora Master",
    status: "active",
  },
  {
    id: "admin-2",
    name: "Rodrigo Mendonça",
    email: "rodrigo.m@techcorp.com.br",
    role: "Analista de D&I e Benefícios",
    status: "active",
  },
];

export default function SettingsScreen({ onTriggerToast }) {
  const [activeTab, setActiveTab] = useState("company"); // company | admins | notifications

  // Estado do formulário de Perfil da Empresa
  const [companyForm, setCompanyForm] = useState({
    companyName: "TechCorp Brasil Servicos LTDA",
    tradingName: "TechCorp Brasil",
    cnpj: "12.345.678/0001-90",
    rhContactEmail: "beneficios.rh@techcorp.com.br",
    phone: "(11) 4002-8922",
    address: "Av. Paulista, 1842 - 14º Andar - São Paulo, SP",
  });

  // Estado dos Administradores
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Analista de RH");
  const [adminError, setAdminError] = useState("");

  // Estado dos Toggles de Notificação estilo iOS
  const [notifications, setNotifications] = useState({
    emailWeeklyDigest: true,
    burnoutAlertThreshold: true,
    licenseCapacityAlert: true,
    smsSecurityAlert: false,
  });

  // Controle de Alterações (Dirty State) para habilitar botão salvar no rodapé
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [localToast, setLocalToast] = useState(null);

  // IDs para Acessibilidade Semântica (WCAG)
  const companyNameId = useId();
  const tradingNameId = useId();
  const cnpjId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();

  const tabListRef = useRef(null);

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  // Validação em Tempo Real com feedback claro (aria-live)
  const handleCompanyChange = (field, value) => {
    setIsModified(true);
    setCompanyForm((prev) => ({ ...prev, [field]: value }));

    const errors = { ...validationErrors };

    if (field === "cnpj") {
      const cleanCnpj = value.replace(/\D/g, "");
      if (cleanCnpj.length > 0 && cleanCnpj.length !== 14) {
        errors.cnpj = "CNPJ inválido. Digite os 14 dígitos cadastrais da empresa.";
      } else {
        delete errors.cnpj;
      }
    }

    if (field === "rhContactEmail") {
      if (value.length > 0 && !value.includes("@")) {
        errors.rhContactEmail = "E-mail de contato corporativo inválido.";
      } else {
        delete errors.rhContactEmail;
      }
    }

    setValidationErrors(errors);
  };

  // Toggle de Notificações estilo iOS com detecção de modificação
  const handleToggleNotification = (key) => {
    setIsModified(true);
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Salvar Alterações com simulação e toast de sucesso
  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    if (Object.keys(validationErrors).length > 0 || !isModified) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsModified(false);
      triggerNotification("As configurações foram salvas com sucesso!");
    }, 1200);
  };

  // Adicionar novo gestor/administrador
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      setAdminError("Preencha o nome e o e-mail corporativo do gestor.");
      return;
    }
    if (!newAdminEmail.includes("@")) {
      setAdminError("Informe um endereço de e-mail corporativo válido.");
      return;
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: newAdminName.trim(),
      email: newAdminEmail.trim().toLowerCase(),
      role: newAdminRole,
      status: "active",
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setNewAdminName("");
    setNewAdminEmail("");
    setAdminError("");
    setIsModified(true);

    triggerNotification(`Administrador ${newAdmin.name} adicionado ao painel.`);
  };

  // Remover admin
  const handleRemoveAdmin = (id, name) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    setIsModified(true);
    triggerNotification(`Acesso administrativo de ${name} removido.`);
  };

  // Navegação por teclado nas Abas (WAI-ARIA Tabs keyboard support)
  const tabsList = [
    { id: "company", label: "Perfil da Empresa", icon: Building2 },
    { id: "admins", label: "Administradores", icon: Users },
    { id: "notifications", label: "Notificações", icon: Bell },
  ];

  const handleTabKeyDown = (e, currentIndex) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabsList.length;
      setActiveTab(tabsList[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
      setActiveTab(tabsList[prevIndex].id);
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
      {/* CABEÇALHO DA SEÇÃO DE CONFIGURAÇÕES                       */}
      {/* ========================================================= */}
      <div>
        <h2 
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Configurações Corporativas
        </h2>
        <p className="text-xs sm:text-sm text-[#516B55] mt-1">
          Ajuste as informações da TechCorp, permissões de administradores e preferências de alerta.
        </p>
      </div>

      {/* ========================================================= */}
      {/* SISTEMA DE ABAS (TABS) ACESSÍVEIS COM TECLADO (WCAG)      */}
      {/* ========================================================= */}
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

      {/* ========================================================= */}
      {/* ABA 1: PERFIL DA EMPRESA (FORMULÁRIO A11Y COM VALIDAÇÃO)  */}
      {/* ========================================================= */}
      {activeTab === "company" && (
        <section
          role="tabpanel"
          id="panel-company"
          aria-labelledby="tab-company"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm space-y-6"
        >
          <div className="border-b border-stone-100 pb-4">
            <h3 
              className="text-base font-bold text-[#294D33]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Dados Cadastrais da Empresa
            </h3>
            <p className="text-xs text-[#516B55]">
              As informações abaixo identificam a sua organização no contrato e na emissão de relatórios.
            </p>
          </div>

          <form onSubmit={handleSaveChanges} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razão Social */}
              <div>
                <label 
                  htmlFor={companyNameId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  Razão Social Completa
                </label>
                <input
                  id={companyNameId}
                  type="text"
                  required
                  value={companyForm.companyName}
                  onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition"
                />
              </div>

              {/* Nome Fantasia */}
              <div>
                <label 
                  htmlFor={tradingNameId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  Nome Fantasia
                </label>
                <input
                  id={tradingNameId}
                  type="text"
                  required
                  value={companyForm.tradingName}
                  onChange={(e) => handleCompanyChange("tradingName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition"
                />
              </div>

              {/* CNPJ com Mensagem de Validação Acessível (aria-live) */}
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

              {/* E-mail de Contato com Validação */}
              <div>
                <label 
                  htmlFor={emailId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  E-mail do Departamento de RH
                </label>
                <input
                  id={emailId}
                  type="email"
                  required
                  value={companyForm.rhContactEmail}
                  onChange={(e) => handleCompanyChange("rhContactEmail", e.target.value)}
                  aria-invalid={!!validationErrors.rhContactEmail}
                  aria-describedby={validationErrors.rhContactEmail ? "email-error" : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition ${
                    validationErrors.rhContactEmail
                      ? "border-red-400 bg-[#FDE8E8]/30 text-[#9B1C1C]"
                      : "border-stone-200 text-stone-800"
                  }`}
                />
                {validationErrors.rhContactEmail && (
                  <p 
                    id="email-error" 
                    role="alert" 
                    aria-live="polite"
                    className="mt-1.5 text-xs text-[#9B1C1C] flex items-center gap-1 font-semibold"
                  >
                    <AlertCircle size={13} aria-hidden="true" />
                    <span>{validationErrors.rhContactEmail}</span>
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label 
                  htmlFor={phoneId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  Telefone Corporativo
                </label>
                <input
                  id={phoneId}
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) => handleCompanyChange("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition"
                />
              </div>

              {/* Endereço */}
              <div>
                <label 
                  htmlFor={addressId}
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  Endereço da Sede
                </label>
                <input
                  id={addressId}
                  type="text"
                  value={companyForm.address}
                  onChange={(e) => handleCompanyChange("address", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition"
                />
              </div>
            </div>

            {/* Aviso de Sigilo & DPA */}
            <div className="p-4 rounded-xl bg-[#FCF7F9] border border-[#F4C4D4]/40 flex items-center gap-3 text-xs text-[#516B55]">
              <ShieldCheck size={20} className="text-[#294D33] shrink-0" aria-hidden="true" />
              <span>
                Suas informações cadastrais estão vinculadas ao Acordo de Processamento de Dados (DPA) em conformidade com as diretrizes do CFM e CFP.
              </span>
            </div>
          </form>
        </section>
      )}

      {/* ========================================================= */}
      {/* ABA 2: ADMINISTRADORES (GESTÃO DE GESTORES DE RH)          */}
      {/* ========================================================= */}
      {activeTab === "admins" && (
        <section
          role="tabpanel"
          id="panel-admins"
          aria-labelledby="tab-admins"
          className="space-y-6"
        >
          {/* Adicionar Novo Gestor */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <h3 
              className="text-base font-bold text-[#294D33] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Conceder Acesso Administrativo
            </h3>
            <p className="text-xs text-[#516B55] mb-4">
              Os gestores cadastrados podem emitir relatórios anonimizados e gerenciar a alocação de licenças.
            </p>

            {adminError && (
              <div 
                role="alert" 
                aria-live="polite"
                className="mb-4 p-3 rounded-xl bg-[#FDE8E8] border border-red-200 text-xs text-[#9B1C1C] font-semibold"
              >
                {adminError}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label 
                  htmlFor="new-admin-name"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                >
                  Nome do Gestor
                </label>
                <input
                  id="new-admin-name"
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Ex: Lucas Ferreira"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
                />
              </div>

              <div className="sm:col-span-4">
                <label 
                  htmlFor="new-admin-email"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                >
                  E-mail Corporativo
                </label>
                <input
                  id="new-admin-email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="lucas@techcorp.com.br"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label 
                  htmlFor="new-admin-role"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                >
                  Permissão
                </label>
                <select
                  id="new-admin-role"
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
                >
                  <option value="Analista de RH">Analista RH</option>
                  <option value="Administrador Master">Master</option>
                  <option value="Auditor D&I">Auditor D&I</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#294D33] hover:bg-[#1f3a27] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
                >
                  <UserPlus size={14} aria-hidden="true" />
                  <span>Adicionar</span>
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Gestores Ativos */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#516B55] uppercase tracking-wider">
                Administradores Ativos ({admins.length})
              </span>
              <span className="text-stone-500">
                Acesso protegido por autenticação em dois fatores (2FA)
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {admins.map((adm) => (
                <div key={adm.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FCE7F0] text-[#294D33] font-bold text-xs flex items-center justify-center border border-[#E8A9BB]/40">
                      {adm.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{adm.name}</p>
                      <span className="text-xs text-[#516B55]">{adm.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                      {adm.role}
                    </span>
                    {admins.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAdmin(adm.id, adm.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#9B1C1C] hover:bg-[#FDE8E8] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
                        aria-label={`Remover permissão de ${adm.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* ABA 3: NOTIFICAÇÕES (TOGGLES ESTILO IOS ACESSÍVEIS)        */}
      {/* ========================================================= */}
      {activeTab === "notifications" && (
        <section
          role="tabpanel"
          id="panel-notifications"
          aria-labelledby="tab-notifications"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm space-y-6"
        >
          <div className="border-b border-stone-100 pb-4">
            <h3 
              className="text-base font-bold text-[#294D33]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Canais de Notificação & Alertas Proativos
            </h3>
            <p className="text-xs text-[#516B55]">
              Configure os gatilhos automáticos para manter a liderança informada sobre a saúde coletiva da equipe.
            </p>
          </div>

          <div className="space-y-4">
            {/* Toggle 1: Relatório Executivo */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition">
              <div className="pr-4">
                <p className="text-sm font-bold text-stone-900">
                  Relatório Executivo Mensal por E-mail
                </p>
                <p className="text-xs text-[#516B55] mt-0.5">
                  Receba automaticamente o consolidado anônimo em PDF no primeiro dia útil de cada mês.
                </p>
              </div>

              {/* Toggle iOS Acessível */}
              <button
                type="button"
                role="switch"
                aria-checked={notifications.emailWeeklyDigest}
                onClick={() => handleToggleNotification("emailWeeklyDigest")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
                  notifications.emailWeeklyDigest ? "bg-[#294D33]" : "bg-stone-300"
                }`}
              >
                <span className="sr-only">Ativar relatório executivo mensal por e-mail</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.emailWeeklyDigest ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Alerta de Sobrecarga */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition">
              <div className="pr-4">
                <p className="text-sm font-bold text-stone-900">
                  Alerta Preventivo de Sobrecarga Coletiva
                </p>
                <p className="text-xs text-[#516B55] mt-0.5">
                  Notificar o RH caso o índice agregado de esgotamento setorial suba mais de 10% no mês.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notifications.burnoutAlertThreshold}
                onClick={() => handleToggleNotification("burnoutAlertThreshold")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
                  notifications.burnoutAlertThreshold ? "bg-[#294D33]" : "bg-stone-300"
                }`}
              >
                <span className="sr-only">Ativar alerta preventivo de sobrecarga</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.burnoutAlertThreshold ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Cota de Licenças */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition">
              <div className="pr-4">
                <p className="text-sm font-bold text-stone-900">
                  Alerta de Atingimento de 90% da Cota de Licenças
                </p>
                <p className="text-xs text-[#516B55] mt-0.5">
                  Receba um aviso antecipado quando restarem menos de 5 vagas disponíveis para novas contratações.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notifications.licenseCapacityAlert}
                onClick={() => handleToggleNotification("licenseCapacityAlert")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
                  notifications.licenseCapacityAlert ? "bg-[#294D33]" : "bg-stone-300"
                }`}
              >
                <span className="sr-only">Ativar alerta de capacidade de licenças</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.licenseCapacityAlert ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4: Faturamento & NF-e */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition">
              <div className="pr-4">
                <p className="text-sm font-bold text-stone-900">
                  Notificações de Faturamento e Notas Fiscais
                </p>
                <p className="text-xs text-[#516B55] mt-0.5">
                  Envio do XML e DANFE da NF-e para o e-mail financeiro assim que emitida.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notifications.smsSecurityAlert}
                onClick={() => handleToggleNotification("smsSecurityAlert")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
                  notifications.smsSecurityAlert ? "bg-[#294D33]" : "bg-stone-300"
                }`}
              >
                <span className="sr-only">Ativar notificações de faturamento e notas fiscais</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.smsSecurityAlert ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* BARRA FIXA DE SALVAR ALTERAÇÕES (FEEDBACK / DISABLED STATE)*/}
      {/* ========================================================= */}
      <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-600">
          {isModified ? (
            <span className="text-[#294D33] font-bold flex items-center gap-1.5 animate-pulse">
              <Sparkles size={14} className="text-[#516B55]" />
              Você possui alterações pendentes para salvar.
            </span>
          ) : (
            <span className="text-stone-400">
              Todas as configurações estão sincronizadas e salvas.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {isModified && (
            <button
              type="button"
              onClick={() => {
                setIsModified(false);
                setValidationErrors({});
                triggerNotification("Alterações descartadas.");
              }}
              className="px-4 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
            >
              Descartar
            </button>
          )}

          {/* Botão Salvar com estado disabled (cinza) e verde escuro (#294D33) quando alterado */}
          <button
            type="button"
            disabled={!isModified || Object.keys(validationErrors).length > 0 || isSaving}
            onClick={handleSaveChanges}
            className={`w-full sm:w-auto px-7 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
              isModified && Object.keys(validationErrors).length === 0
                ? "bg-[#294D33] hover:bg-[#1f3a27] text-white shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
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
    </div>
  );
}
