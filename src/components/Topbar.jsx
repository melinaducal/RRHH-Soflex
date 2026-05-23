import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, actions }) {
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
      <h1 style={{ fontSize: 15, fontWeight: 500 }}>{title}</h1>
      {actions && <div className="topbar-actions">{actions}</div>}
    </header>
  )
}
