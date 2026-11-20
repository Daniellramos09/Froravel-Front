// src/Screen/Dashboard/components/HomeAgenda.jsx
// Próximos compromissos: roda de conversa e consultas marcadas.
import { useState } from 'react';
import { Check, Video } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

const linkBtn = `text-[14px] @3xl:text-[15px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`;

export default function HomeAgenda({ agendamentos = [], onGoBooking, onGoGroups, onGoNetwork }) {
  const [lembreteAtivo, setLembreteAtivo] = useState(false);

  const handleWhatsAppReminder = () => {
    setLembreteAtivo(true);
    const text = encodeURIComponent(
      "Olá! Seu lembrete da Roda Florável: 'O Sono e a Sanidade Materna' acontece terça às 15h. Vaga confirmada!"
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener');
  };

  return (
    <section aria-labelledby="agenda-titulo">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="agenda-titulo" className="font-fraunces text-[22px] @3xl:text-[28px] @5xl:text-[30px] leading-[1.15] tracking-[-0.015em] text-[#1F3A27]">
          Na sua agenda
        </h2>
        <button type="button" onClick={onGoBooking} className={linkBtn}>
          Ver tudo
        </button>
      </div>

      <ul className="mt-3.5 @3xl:mt-6 space-y-2">
        {agendamentos.map((a) => (
          <li key={a.id} className="rounded-xl @3xl:rounded-lg bg-[#F1E6E1] p-4">
            <p className="text-[13px] @3xl:text-[14px] text-[#4A5E4D] tabular-nums">{a.date} · {a.time}</p>
            <p className="mt-0.5 text-[15px] @3xl:text-[16px] font-medium text-[#2B2829]">{a.profName}</p>
            {a.type && <p className="text-[13px] @3xl:text-[14px] text-[#4A5E4D]">{a.type}</p>}
          </li>
        ))}

        <li className="rounded-xl @3xl:rounded-lg bg-[#F1E6E1] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12.5px] @3xl:text-[14px] text-[#4A5E4D]">Terça · 15:00 · Com Psi. Ana Beatriz</p>
              <p className="mt-1 text-[15px] @3xl:text-[16px] font-medium text-[#2B2829] leading-snug">
                Roda: O sono do bebê e a sanidade materna
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={onGoGroups}
              className={`inline-flex items-center gap-2 rounded-lg @3xl:rounded-md bg-[#294D33] px-3.5 py-2 text-[13.5px] @3xl:text-[14px] font-medium text-white hover:bg-[#1F3A27] cursor-pointer ${focusRing}`}
            >
              <Video size={15} strokeWidth={1.75} aria-hidden="true" />
              Entrar na sala
            </button>
            <button
              type="button"
              onClick={handleWhatsAppReminder}
              className={`inline-flex items-center gap-1.5 text-[13.5px] @3xl:text-[14px] font-medium text-[#294D33] rounded-sm cursor-pointer hover:underline underline-offset-4 ${focusRing}`}
            >
              {lembreteAtivo && <Check size={15} strokeWidth={2} aria-hidden="true" />}
              {lembreteAtivo ? 'Lembrete enviado' : 'Lembrar no WhatsApp'}
            </button>
          </div>
        </li>
      </ul>

      {agendamentos.length === 0 && (
        <p className="hidden @3xl:block mt-4 text-[15px] text-[#4A5E4D]">
          Nenhuma consulta marcada.{' '}
          <button type="button" onClick={onGoNetwork} className={linkBtn}>
            Encontrar uma psicóloga
          </button>
        </p>
      )}
    </section>
  );
}
