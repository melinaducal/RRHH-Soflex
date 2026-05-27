import { useState } from 'react'
import { auth } from '../services/api'
 
export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState(null)
  const [cargando, setCargando] = useState(false)
  const [verPass, setVerPass]   = useState(false)
 
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await auth.login(usuario, password)
      onLogin()
    } catch (err) {
      setError(err.message || 'Usuario o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }
 
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
 
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--blue-400)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <i className="ti ti-briefcase" style={{ color: '#fff', fontSize: 26 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>LicenciasPro</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Gestión de RRHH · Ingresá a tu cuenta</div>
        </div>
 
        {/* Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
 
          {error && (
            <div className="alert alert-err" style={{ marginBottom: '1.25rem' }}>
              <i className="ti ti-alert-circle" />
              {error}
            </div>
          )}
 
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="usuario">Usuario</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-user" style={{
                  position: 'absolute', left: 10, top: '50%',
                  transform: 'translateY(-50%)', color: '#aaa', fontSize: 16,
                }} />
                <input
                  type="text"
                  id="usuario"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  placeholder="Ej: juan.perez"
                  style={{ paddingLeft: 34 }}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>
 
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock" style={{
                  position: 'absolute', left: 10, top: '50%',
                  transform: 'translateY(-50%)', color: '#aaa', fontSize: 16,
                }} />
                <input
                  type={verPass ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  style={{ paddingLeft: 34, paddingRight: 38 }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setVerPass(v => !v)}
                  style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#aaa', padding: 0,
                  }}
                  aria-label={verPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i className={`ti ${verPass ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
 
            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            >
              {cargando
                ? <><i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite' }} /> Ingresando...</>
                : <><i className="ti ti-login" /> Ingresar</>
              }
            </button>
          </form>
        </div>
 
        <div style={{ textAlign: 'center', fontSize: 12, color: '#bbb', marginTop: '1.5rem' }}>
          SOFLEX · Sistema de gestión de licencias
        </div>
      </div>
 
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}