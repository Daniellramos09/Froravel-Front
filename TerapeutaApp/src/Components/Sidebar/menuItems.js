// Itens do menu do Portal do Terapeuta: usados no menu lateral e na barra inferior do celular.
import { LayoutGrid, Calendar, Users, Video, MessagesSquare } from 'lucide-react';

export const menuItems = [
  { name: 'Visão geral', short: 'Início', path: '/painel', icon: LayoutGrid },
  { name: 'Agenda', short: 'Agenda', path: '/agenda', icon: Calendar },
  { name: 'Mães atendidas', short: 'Mães', path: '/maes', icon: Users },
  { name: 'Sala de acolhimento', short: 'Sala', path: '/sala', icon: Video },
  { name: 'Comunidade', short: 'Comunidade', path: '/comunidade', icon: MessagesSquare },
];
