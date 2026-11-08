import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './Components/Layout/AppLayout';
import DashboardLayout from './Components/Sidebar/DashboardLayout';
import Painel from './Screen/Painel';
import Agenda from './Screen/Agenda';
import MaesAtendidas from './Screen/MaesAtendidas';
import SalaAcolhimento from './Screen/SalaAcolhimento';
import Comunidade from './Screen/Comunidade';




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path="/painel" element={<Painel />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/maes" element={<MaesAtendidas />} />
            <Route path="/sala" element={<SalaAcolhimento />} />
            <Route path="/comunidade" element={<Comunidade />} />
          </Route>

          <Route path="/" element={<Navigate to="/painel" replace />} />
          <Route path="*" element={<Navigate to="/painel" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}