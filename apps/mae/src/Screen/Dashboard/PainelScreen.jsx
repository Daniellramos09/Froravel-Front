import DashboardScreen from './DashboardScreen';

/**
 * PainelScreen
 * Componente de retrocompatibilidade que renderiza o DashboardScreen refatorado.
 */
export default function PainelScreen({ setActiveTab, userName = "Mariana" }) {
  return <DashboardScreen setActiveTab={setActiveTab} userName={userName} />;
}
