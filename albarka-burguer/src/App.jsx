import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/Layout/DashboardLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Facturacion from './pages/Facturacion/Facturacion'
import Anulacion from './pages/Anulacion/Anulacion'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="facturacion" element={<Facturacion />} />
        <Route path="anulacion" element={<Anulacion />} />
      </Route>
    </Routes>
  )
}
