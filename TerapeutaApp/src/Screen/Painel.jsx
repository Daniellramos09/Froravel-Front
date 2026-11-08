import { Plus, CalendarClock, Calendar, Users, User, Video, ChevronRight } from 'lucide-react';

const stats = [
  { icon: CalendarClock, value: '2', label: 'Atendimentos hoje' },
  { icon: Calendar, value: '3', label: 'Próximas sessões' },
  { icon: Users, value: '7', label: 'Mães acompanhadas' },
  { icon: Users, value: '23/10', label: 'Próximo grupo', extra: '18:00 · 3/5 vagas' },
];

const appointments = [
  { hora: '18:00', dia: 'Sexta 23/10', titulo: 'Roda: os primeiros meses', tipo: 'Grupo', info: '3/5', grupo: true },
  { hora: '10:00', dia: 'Sábado 24/10', titulo: 'Juliana Costa', tipo: 'Individual', info: 'Escuta e acolhimento', grupo: false },
  { hora: '19:00', dia: 'Quarta 28/10', titulo: 'Roda: rede de apoio', tipo: 'Grupo', info: '4/10', grupo: true },
];

function getSaudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Painel() {
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full">
      {/* Cabeçalho */}
      <header className="rounded-2xl bg-[#F1E6E1] p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
            {dataHoje}
          </p>
          <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
            {getSaudacao()}, Dra. Helena Souza
          </h1>
          <p className="mt-2 text-[15px] text-[#4A5E4D]">Veja o que pede sua atenção hoje.</p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-6 py-3 text-[14px] font-bold text-white shadow-sm hover:bg-[#1F3A27] transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Nova sessão
        </button>
      </header>

      {/* Cards */}
      <section className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ icon: Icon, value, label, extra }) => (
          <div
            key={label}
            className="rounded-3xl bg-white border border-[#EFE9EB] p-5 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#F4DDE5] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#294D33]" />
            </div>
            <p className="mt-4 font-fraunces text-[32px] leading-none text-[#1F3A27]">{value}</p>
            <p className="text-sm text-[#4A5E4D]">{label}</p>
            {extra && <p className="text-xs text-stone-500 mt-1">{extra}</p>}
          </div>
        ))}
      </section>

      {/* Próximos atendimentos */}
      <section className="mt-8 rounded-3xl bg-white border border-[#EFE9EB] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="font-fraunces text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.015em] text-[#1F3A27]">Próximos atendimentos</h2>
            <p className="text-xs text-stone-500">Dados fictícios de demonstração</p>
          </div>
          <button className="rounded-full bg-[#F4DDE5] px-4 py-1.5 text-xs font-semibold text-[#294D33] hover:bg-[#E8A9BB]/50">
            Ver agenda
          </button>
        </div>

        <ul className="divide-y divide-[#EFE9EB] border-t border-[#EFE9EB]">
          {appointments.map((a) => (
            <li
              key={a.titulo}
              className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-24">
                  <p className="text-lg font-bold text-[#2B2829]">{a.hora}</p>
                  <p className="text-xs text-stone-500">{a.dia}</p>
                </div>
                <div>
                  <p className="font-bold text-[#2B2829]">{a.titulo}</p>
                  <p className="flex items-center gap-1 text-xs text-stone-500">
                    {a.grupo ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {a.tipo} · {a.info}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#F1E6E1] px-3 py-1 text-xs font-medium text-[#4A5E4D]">
                  Agendada
                </span>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3ED] px-3 py-1.5 text-xs font-semibold text-[#294D33]">
                  <Video className="w-3.5 h-3.5" />
                  Sala
                </button>
                <button className="inline-flex items-center gap-1 text-xs font-medium text-[#2B2829] hover:text-[#294D33]">
                  Detalhes <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}