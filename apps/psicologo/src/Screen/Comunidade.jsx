// Tela da Comunidade no Portal do Terapeuta: os posts da terapeuta aparecem com o selo "Terapeuta".
import FeedScreen from './Comunidade/FeedScreen';

const TERAPEUTA = {
  id: 'helena-souza',
  name: 'Dra. Helena Souza',
  initials: 'HS',
  role: 'terapeuta',
  detail: 'CRP 06/142980',
};

export default function Comunidade() {
  return <FeedScreen currentUser={TERAPEUTA} />;
}
