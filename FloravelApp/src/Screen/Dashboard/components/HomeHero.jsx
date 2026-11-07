// src/Screen/Dashboard/components/HomeHero.jsx
// Hero editorial da página inicial: saudação, frase de alívio, ação de cuidado
// e três módulos ilustrados para descobrir rede, rodas e leituras.
import { ArrowRight, ArrowUpRight } from 'lucide-react';

function greetingFor(date) {
  const h = date.getHours();
  if (h < 5) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1E6E1]';

function Module({ title, detail, img, bg, ink, sub, onClick, label }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        style={{ backgroundColor: bg }}
        className={`group relative flex flex-row @2xl:flex-col justify-between w-full h-[148px] @2xl:h-[365px] rounded-lg overflow-hidden text-left cursor-pointer ${focusRing}`}
      >
        <span className="relative z-10 flex flex-col justify-center @2xl:justify-start p-5 @2xl:pb-2 flex-1 min-w-0">
          <span className="flex items-start justify-between gap-2">
            <span
              className="font-fraunces text-[21px] @5xl:text-[23px] leading-[1.12] tracking-[-0.015em]"
              style={{ color: ink }}
            >
              {title}
            </span>
            <ArrowUpRight
              size={19}
              strokeWidth={1.75}
              aria-hidden="true"
              className="shrink-0 mt-0.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              style={{ color: ink }}
            />
          </span>
          <span
            className="mt-1.5 block text-[13.5px] leading-[1.35] max-w-[26ch]"
            style={{ color: sub }}
          >
            {detail}
          </span>
        </span>

        <span className="relative flex items-end justify-center w-[155px] @2xl:w-full h-full @2xl:h-[225px] shrink-0 @2xl:mt-auto pt-2 px-1.5 overflow-hidden">
          <img
            src={img}
            alt=""
            className="w-full max-h-full object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </span>
      </button>
    </li>
  );
}

export default function HomeHero({
  userName,
  postpartumWeek,
  flowersCount,
  targetFlowers,
  onStartPause,
  onOpenDiary,
  onOpenInvite,
  onGoNetwork,
  onGoGroups,
  onGoLibrary,
}) {
  const remaining = Math.max(0, targetFlowers - flowersCount);

  return (
    <section
      aria-labelledby="home-titulo"
      className="rounded-xl bg-[#F1E6E1] p-6 @xl:p-8 @5xl:p-10 grid gap-8 @3xl:grid-cols-[minmax(0,4.7fr)_minmax(0,7.3fr)] @3xl:gap-8 @5xl:gap-10 items-stretch"
    >
      {/* Texto */}
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-[15px] text-[#4A5E4D]">
            {greetingFor(new Date())}, {userName}
            <span aria-hidden="true" className="mx-2 text-[#4A5E4D]/50">·</span>
            <span>puerpério, semana {postpartumWeek}</span>
          </p>

          <h1
            id="home-titulo"
            className="mt-5 font-fraunces font-normal text-[36px] @3xl:text-[40px] @5xl:text-[46px] leading-[1.05] tracking-[-0.025em] text-[#1F3A27] text-balance"
          >
            Você não precisa dar conta de tudo hoje.
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={onStartPause}
              className={`group inline-flex items-center gap-2.5 rounded-md bg-[#294D33] px-5 py-3.5 text-[15px] font-medium text-white hover:bg-[#1F3A27] cursor-pointer ${focusRing}`}
            >
              Fazer uma pausa de 1 minuto
              <ArrowRight
                size={17}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
            <button
              type="button"
              onClick={onOpenDiary}
              className={`text-[15px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-[5px] hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
            >
              Escrever no diário
            </button>
          </div>
        </div>

        {/* Flores solidárias: presente, mas discreto */}
        <p className="pt-8 text-[14px] leading-relaxed text-[#4A5E4D]">
          <span className="font-medium text-[#1F3A27] tabular-nums">{flowersCount} flores solidárias.</span>{' '}
          {remaining > 0
            ? `Faltam ${remaining} para uma consulta gratuita.`
            : 'Você já pode usar uma consulta gratuita.'}{' '}
          <button
            type="button"
            onClick={onOpenInvite}
            className={`font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
          >
            Indicar uma mãe
          </button>
        </p>
      </div>

      {/* Módulos ilustrados */}
      <ul
        className="grid grid-cols-1 @2xl:grid-cols-[1.08fr_1fr_0.94fr] gap-3.5"
        aria-label="Para onde ir"
      >
        <Module
          title="Rede de apoio"
          detail="Psicólogas perinatais com valor social"
          img="/img/ilustracoes/rede.jpg"
          bg="#E6AEB7"
          ink="#1F3A27"
          sub="#382E30"
          onClick={onGoNetwork}
          label="Rede de apoio: encontrar uma psicóloga perinatal"
        />
        <Module
          title="Rodas de conversa"
          detail="Terça, 15h · O sono e a sanidade materna"
          img="/img/ilustracoes/roda.jpg"
          bg="#284A32"
          ink="#FBF6F2"
          sub="#E4DDD5"
          onClick={onGoGroups}
          label="Rodas de conversa: próxima terça às 15h"
        />
        <Module
          title="Para ler hoje"
          detail="Baby blues ou depressão pós-parto?"
          img="/img/ilustracoes/leitura.jpg"
          bg="#E6D0B8"
          ink="#1F3A27"
          sub="#43382C"
          onClick={onGoLibrary}
          label="Para ler hoje: baby blues ou depressão pós-parto"
        />
      </ul>
    </section>
  );
}
