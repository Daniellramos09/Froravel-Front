// src/Screen/Services/ApoioScreen.jsx
import React from "react";
import SupportNetworkScreen from "./SupportNetworkScreen";

/**
 * Rede de Apoio (Painel da Mãe) - Florável
 * Renderiza o componente principal refatorado SupportNetworkScreen
 * mantendo compatibilidade total com os parâmetros de agendamento de App.jsx
 */
export default function ApoioScreen(props) {
  return <SupportNetworkScreen {...props} />;
}

export { SupportNetworkScreen };
