// Feed da Comunidade: posts no estilo de rede social, com curtidas e comentários.
// Este arquivo existe igual no app da Mãe e no app do Terapeuta: se mudar um, copie para o outro.
// Posts e comentários de terapeutas aparecem com o selo de profissional verificada.
import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { carregarFeed, salvarFeed, AUTOR_ANONIMO } from './feedData';

const LIMITE = 500;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2';

function tempoRelativo(iso) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  if (h < 48) return 'ontem';
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function Avatar({ author, size = 'md' }) {
  const terapeuta = author.role === 'terapeuta';
  const tamanho = size === 'sm' ? 'w-8 h-8 text-[11px]' : 'w-11 h-11 text-[14px]';
  return (
    <div
      aria-hidden="true"
      className={`${tamanho} shrink-0 rounded-full flex items-center justify-center font-bold ${
        terapeuta
          ? 'bg-[#294D33] text-white ring-2 ring-[#EBF3ED]'
          : 'bg-[#F4DDE5] text-[#294D33] border border-[#E8A9BB]/40'
      }`}
    >
      {author.initials}
    </div>
  );
}

// Nome + selo de terapeuta + detalhe (semana do puerpério, CRP...)
function Autor({ author, time, size = 'md' }) {
  const terapeuta = author.role === 'terapeuta';
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className={`font-bold text-[#2B2829] ${size === 'sm' ? 'text-[13.5px]' : 'text-[15px]'}`}>
          {author.name}
        </span>
        {terapeuta && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF3ED] px-2 py-0.5 text-[11px] font-bold text-[#294D33]">
            <BadgeCheck size={13} aria-hidden="true" />
            Terapeuta
          </span>
        )}
      </div>
      <p className={`text-stone-500 ${size === 'sm' ? 'text-[12px]' : 'text-[12.5px]'}`}>
        {author.detail}
        {time && <span> · {tempoRelativo(time)}</span>}
      </p>
    </div>
  );
}

function PostCard({ post, currentUser, onLike, onComment, onDelete }) {
  const [abertos, setAbertos] = useState(false);
  const [comentario, setComentario] = useState('');
  const doUsuario = post.author.id === currentUser.id || post.mine;
  const terapeuta = post.author.role === 'terapeuta';

  const enviarComentario = (e) => {
    e.preventDefault();
    const texto = comentario.trim();
    if (!texto) return;
    onComment(post.id, texto);
    setComentario('');
    setAbertos(true);
  };

  return (
    <article
      className={`bg-white rounded-3xl border p-5 sm:p-6 ${
        terapeuta ? 'border-[#294D33]/15 shadow-[0_1px_0_#EBF3ED]' : 'border-[#EFE9EB]'
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar author={post.author} />
          <Autor author={post.author} time={post.createdAt} />
        </div>
        {doUsuario && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Excluir este post?')) onDelete(post.id);
            }}
            className={`p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer ${focusRing}`}
            aria-label="Excluir post"
            title="Excluir post"
          >
            <Trash2 size={17} />
          </button>
        )}
      </header>

      <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-[#2B2829] whitespace-pre-line break-words">
        {post.text}
      </p>

      {/* Ações */}
      <div className="mt-4 flex items-center gap-1 border-t border-[#EFE9EB] pt-3 -mx-2">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          aria-pressed={post.liked}
          aria-label={post.liked ? 'Descurtir' : 'Curtir'}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium transition cursor-pointer ${focusRing} ${
            post.liked ? 'text-[#C2185B] bg-[#F4DDE5]/60' : 'text-stone-600 hover:bg-[#FCF7F9] hover:text-[#294D33]'
          }`}
        >
          <Heart size={18} className={post.liked ? 'fill-current' : ''} aria-hidden="true" />
          <span className="tabular-nums">{post.likes}</span>
        </button>
        <button
          type="button"
          onClick={() => setAbertos((v) => !v)}
          aria-expanded={abertos}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-[#FCF7F9] hover:text-[#294D33] transition cursor-pointer ${focusRing}`}
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span className="tabular-nums">{post.comments.length}</span>
          <span className="sr-only">comentários</span>
        </button>
      </div>

      {/* Comentários */}
      {abertos && (
        <div className="mt-3 space-y-3 animate-fadeIn">
          {post.comments.length === 0 && (
            <p className="text-[13.5px] text-stone-500">Seja a primeira pessoa a comentar.</p>
          )}
          {post.comments.map((c) => (
            <div
              key={c.id}
              className={`flex gap-3 rounded-2xl p-3 ${c.author.role === 'terapeuta' ? 'bg-[#EBF3ED]/70' : 'bg-[#FCF7F9]'}`}
            >
              <Avatar author={c.author} size="sm" />
              <div className="min-w-0">
                <Autor author={c.author} time={c.createdAt} size="sm" />
                <p className="mt-1 text-[14px] leading-relaxed text-[#2B2829] break-words">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={enviarComentario} className="mt-3 flex items-center gap-2">
        <Avatar author={currentUser} size="sm" />
        <label htmlFor={`comentar-${post.id}`} className="sr-only">
          Escrever um comentário
        </label>
        <input
          id={`comentar-${post.id}`}
          value={comentario}
          onChange={(e) => setComentario(e.target.value.slice(0, LIMITE))}
          placeholder="Escreva um comentário acolhedor…"
          className="flex-1 min-w-0 rounded-full border border-[#E4DAD5] bg-[#FCF7F9] px-4 py-2.5 text-[14px] text-[#2B2829] placeholder-stone-400 outline-none transition focus:border-[#294D33] focus:bg-white"
        />
        <button
          type="submit"
          disabled={!comentario.trim()}
          className={`p-2.5 rounded-full bg-[#294D33] text-white hover:bg-[#1F3A27] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer ${focusRing}`}
          aria-label="Enviar comentário"
        >
          <Send size={16} />
        </button>
      </form>
    </article>
  );
}

export default function FeedScreen({ currentUser, allowAnonymous = false, showCrisisNote = false }) {
  const [posts, setPosts] = useState(carregarFeed);
  const [texto, setTexto] = useState('');
  const [anonima, setAnonima] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    salvarFeed(posts);
  }, [posts]);

  const visiveis = useMemo(
    () => (filtro === 'profissionais' ? posts.filter((p) => p.author.role === 'terapeuta') : posts),
    [posts, filtro]
  );

  const publicar = (e) => {
    e.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo) return;
    const author = allowAnonymous && anonima ? AUTOR_ANONIMO : currentUser;
    setPosts((prev) => [
      { id: novoId(), author, text: conteudo, createdAt: new Date().toISOString(), likes: 0, liked: false, comments: [], mine: true },
      ...prev,
    ]);
    setTexto('');
    setAnonima(false);
  };

  const curtir = (id) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))
    );

  const comentar = (id, text) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { id: novoId(), author: currentUser, text, createdAt: new Date().toISOString() }] }
          : p
      )
    );

  const excluir = (id) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const ehTerapeuta = currentUser.role === 'terapeuta';

  return (
    <div className="w-full max-w-2xl mx-auto font-dmsans text-[#2B2829] animate-fadeIn">
      <header>
        <h1 className="font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
          Comunidade
        </h1>
        <p className="mt-2 text-[15px] text-[#4A5E4D]">
          {ehTerapeuta
            ? 'Compartilhe orientações com as mães. Seus posts aparecem com o selo de terapeuta.'
            : 'Um espaço para dividir o dia, pedir apoio e acolher outras mães.'}
        </p>
      </header>

      {/* Novo post */}
      <form onSubmit={publicar} className="mt-6 bg-white rounded-3xl border border-[#EFE9EB] p-5 sm:p-6">
        <div className="flex gap-3">
          <Avatar author={allowAnonymous && anonima ? AUTOR_ANONIMO : currentUser} />
          <div className="flex-1 min-w-0">
            <label htmlFor="novo-post" className="sr-only">
              Escrever um post
            </label>
            <textarea
              id="novo-post"
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, LIMITE))}
              rows={3}
              placeholder={ehTerapeuta ? 'Escreva uma orientação ou um convite para as mães…' : 'Como você está hoje?'}
              className="w-full resize-none rounded-2xl border border-[#E4DAD5] bg-[#FCF7F9] px-4 py-3 text-[15px] leading-relaxed text-[#2B2829] placeholder-stone-400 outline-none transition focus:border-[#294D33] focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:pl-14">
          <div className="flex items-center gap-4">
            {allowAnonymous && (
              <label className="inline-flex items-center gap-2 text-[13.5px] text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={anonima}
                  onChange={(e) => setAnonima(e.target.checked)}
                  className="h-4 w-4 accent-[#294D33]"
                />
                Publicar como anônima
              </label>
            )}
            <span className="text-[12px] text-stone-400 tabular-nums">
              {texto.length}/{LIMITE}
            </span>
          </div>
          <button
            type="submit"
            disabled={!texto.trim()}
            className={`rounded-full bg-[#294D33] px-6 py-2.5 text-[14px] font-bold text-white shadow-sm hover:bg-[#1F3A27] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer ${focusRing}`}
          >
            Publicar
          </button>
        </div>
      </form>

      {showCrisisNote && (
        <p className="mt-3 text-[13px] text-stone-500 px-1">
          Em um momento de crise, não espere por respostas aqui: ligue <strong className="text-[#294D33]">188 (CVV)</strong>, gratuito e 24h.
        </p>
      )}

      {/* Filtro */}
      <div className="mt-6 inline-flex rounded-full bg-[#F1E6E1] p-1" role="tablist" aria-label="Filtrar posts">
        {[
          { id: 'todos', nome: 'Todos' },
          { id: 'profissionais', nome: 'Profissionais' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filtro === f.id}
            onClick={() => setFiltro(f.id)}
            className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition cursor-pointer ${focusRing} ${
              filtro === f.id ? 'bg-white text-[#294D33] font-bold shadow-sm' : 'text-stone-600 hover:text-[#294D33]'
            }`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="mt-4 space-y-4">
        {visiveis.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={curtir}
            onComment={comentar}
            onDelete={excluir}
          />
        ))}
        {visiveis.length === 0 && (
          <p className="rounded-3xl border border-dashed border-[#E4DAD5] p-8 text-center text-[14px] text-stone-500">
            Nenhum post por aqui ainda.
          </p>
        )}
      </div>
    </div>
  );
}
