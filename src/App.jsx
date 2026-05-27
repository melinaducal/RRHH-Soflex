import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar      from './components/Sidebar'
import Topbar       from './components/Topbar'
import Dashboard    from './pages/Dashboard'
import Calendario   from './pages/Calendario'
import Licencias    from './pages/Licencias'
import Turnos       from './pages/Turnos'
import Usuarios     from './pages/Usuarios'
import NuevoUsuario from './pages/NuevoUsuario'
import './styles.css'

export default function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar abierto={sidebarAbierto} onCerrar={() => setSidebarAbierto(false)} />
        <div className="main-content">
          <Topbar onMenuClick={() => setSidebarAbierto(v => !v)} />
          <Routes>
            <Route path="/"               element={<Dashboard />} />
            <Route path="/calendario"     element={<Calendario />} />
            <Route path="/licencias"      element={<Licencias />} />
            <Route path="/turnos"         element={<Turnos />} />
            <Route path="/usuarios"       element={<Usuarios />} />
            <Route path="/nuevo-usuario"  element={<NuevoUsuario />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}