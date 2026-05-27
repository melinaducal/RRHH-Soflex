import { AppContext } from '../AppContext.jsx'
import { useContext } from 'react'

export default function Topbar({ title, actions }) {
  const { onMenuClick } = useContext(AppContext)

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: '#fff',
      borderBottom: '0.5px solid rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          style={{ padding: '6px 8px' }}
        >
          <i className="ti ti-menu-2" style={{ fontSize: 20 }} />
        </button>
        <h1 style={{ fontSize: 15, fontWeight: 500 }}>{title}</h1>
      </div>
      {actions && <div className="topbar-actions">{actions}</div>}
    </header>
  )
}