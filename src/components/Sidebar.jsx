import { NavLink } from 'react-router-dom'
import { auth } from '../services/api'
 
const navItems = [
  { to: '/',          icon: 'ti-layout-dashboard', label: 'Inicio',           section: 'Principal' },
  { to: '/calendario',icon: 'ti-calendar',         label: 'Calendario',       section: 'Principal' },
  { to: '/licencias', icon: 'ti-file-text',        label: 'Licencias',        section: 'Principal' },
  { to: '/turnos',    icon: 'ti-clock',            label: 'Turnos rotativos', section: 'Principal' },
  { to: '/usuarios',  icon: 'ti-users',            label: 'Empleados',        section: 'Administración' },
  { to: '/nuevo-usuario', icon: 'ti-user-plus',   label: 'Nuevo empleado',   section: 'Administración' },
]
 
const sections = ['Principal', 'Administración']
 
// Usuario de sesión — reemplazar con contexto de auth real
const SESSION_USER = { nombre: 'M. Gomez', rol: 'RRHH · Admin', iniciales: 'MG' }
 
export default function Sidebar() {
  return (
    <aside style={{
      width: 'var(--sidebar)',
      minHeight: '100vh',
      background: '#fff',
      borderRight: '0.5px solid rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      position: 'relative',
      top: 0, left: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ padding: '0 1.25rem 1.25rem', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--blue-400)', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="ti ti-briefcase" style={{ color: '#fff', fontSize: 16 }} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>LicenciasPro</div>
            <div style={{ fontSize: 11, color: '#888' }}>Gestión de RRHH</div>
          </div>
        </div>
      </div>
 
      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
        {sections.map(section => (
          <div key={section} style={{ marginBottom: '0.5rem' }}>
            <div style={{
              fontSize: 10, color: '#aaa', textTransform: 'uppercase',
              letterSpacing: '0.08em', padding: '0.75rem 0.5rem 0.25rem',
              fontWeight: 500,
            }}>
              {section}
            </div>
            {navItems.filter(n => n.section === section).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', fontSize: 13.5,
                  color: isActive ? 'var(--blue-800)' : '#555',
                  background: isActive ? 'var(--blue-50)' : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'all 0.15s',
                  marginBottom: 2,
                })}
              >
                <i className={`ti ${item.icon}`} style={{ fontSize: 17 }} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
 
      {/* Footer user */}
      <div style={{ padding: '1rem 1.25rem 0', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: '1rem' }}>
          <div className="avatar avatar-md">{SESSION_USER.iniciales}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{SESSION_USER.nombre}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{SESSION_USER.rol}</div>
          </div>
          <button
            onClick={() => auth.logout()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4 }}
            title="Cerrar sesión"
          >
            <i className="ti ti-logout" style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </aside>
  )
}