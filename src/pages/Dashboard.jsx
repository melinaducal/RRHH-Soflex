import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { formatFecha, iniciales, TIPOS_LICENCIA } from '../utils/vacaciones'

// Datos de ejemplo — reemplazar con llamadas reales a la API
const MOCK_RESUMEN = {
  empleadosActivos: 42,
  conLicenciaHoy: 7,
  desgloseLicencias: '4 vacac. · 2 enf. · 1 mat.',
  solicitudesPendientes: 3,
  turnosSemana: 18,
}

const MOCK_AUSENTES = [
  { id:1, nombre:'E. Zarate',    tipo:'vacaciones', hasta:'2026-05-30', color:'badge-vac' },
  { id:2, nombre:'F. Perla',   tipo:'maternidad', hasta:'2026-08-15', color:'badge-mat' },
  { id:3, nombre:'M. Ducal',tipo:'enfermedad', hasta:'2026-05-21', color:'badge-enf' },
  { id:4, nombre:'I. Lamas',   tipo:'vacaciones', hasta:'2026-05-25', color:'badge-vac' },
  { id:5, nombre:'J. Sotelo',    tipo:'estudio',    hasta:'2026-05-18', color:'badge-est' },
]

const MOCK_PENDIENTES = [
  { id:10, nombre:'G. Scapin', tipo:'vacaciones', desde:'2026-06-01', hasta:'2026-06-15', dias:10, conCert: false },
  { id:11, nombre:'A. Blanco',  tipo:'enfermedad', desde:'2026-05-18', hasta:'2026-05-20', dias:3,  conCert: true  },
]

function tipoLabel(tipo) {
  return TIPOS_LICENCIA.find(t => t.value === tipo)?.label || tipo
}
function tipoBadge(tipo) {
  return TIPOS_LICENCIA.find(t => t.value === tipo)?.badge || 'badge-otro'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [resumen, setResumen] = useState(MOCK_RESUMEN)
  const [ausentes, setAusentes] = useState(MOCK_AUSENTES)
  const [pendientes, setPendientes] = useState(MOCK_PENDIENTES)
  const [loading, setLoading] = useState(false)

  // Descomentar para usar datos reales:
  // useEffect(() => {
  //   setLoading(true)
  //   Promise.all([
  //     dashboardApi.resumen(),
  //     licenciasApi.list({ estado: 'aprobada', fecha: new Date().toISOString().split('T')[0] }),
  //     licenciasApi.list({ estado: 'pendiente' }),
  //   ]).then(([res, aus, pend]) => {
  //     setResumen(res)
  //     setAusentes(aus)
  //     setPendientes(pend)
  //   }).finally(() => setLoading(false))
  // }, [])

  async function handleAprobar(id) {
    // await licenciasApi.aprobar(id)
    setPendientes(prev => prev.filter(p => p.id !== id))
  }

  async function handleRechazar(id) {
    // await licenciasApi.rechazar(id, 'Sin justificación suficiente')
    setPendientes(prev => prev.filter(p => p.id !== id))
  }

  return (
    <>
      <Topbar
        title="Inicio"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/licencias')}>
            <i className="ti ti-plus" aria-hidden="true" /> Nueva licencia
          </button>
        }
      />
      <div className="page-content">

        {/* Métricas */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Empleados activos</div>
            <div className="stat-value" style={{ color: 'var(--blue-400)' }}>{resumen.empleadosActivos}</div>
            <div className="stat-sub">en planta total</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Con licencia hoy</div>
            <div className="stat-value" style={{ color: 'var(--teal-400)' }}>{resumen.conLicenciaHoy}</div>
            <div className="stat-sub">{resumen.desgloseLicencias}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Solicitudes pendientes</div>
            <div className="stat-value" style={{ color: 'var(--amber-400)' }}>{resumen.solicitudesPendientes}</div>
            <div className="stat-sub">requieren aprobación</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Turnos esta semana</div>
            <div className="stat-value" style={{ color: 'var(--coral-400)' }}>{resumen.turnosSemana}</div>
            <div className="stat-sub">rotativos asignados</div>
          </div>
        </div>

        <div className="two-col">
          {/* Ausentes hoy */}
          <div className="card">
            <div className="card-title">
              <i className="ti ti-user-off" aria-hidden="true" /> Ausentes hoy
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {ausentes.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)',
                }}>
                  <div className="avatar avatar-sm">{iniciales(a.nombre)}</div>
                  <div style={{ flex: 1, fontSize: 13 }}>{a.nombre}</div>
                  <span className={`badge ${tipoBadge(a.tipo)}`}>{tipoLabel(a.tipo)}</span>
                  <div style={{ fontSize: 11, color: '#888' }}>hasta {formatFecha(a.hasta)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Solicitudes pendientes */}
          <div className="card">
            <div className="card-title">
              <i className="ti ti-clock-check" aria-hidden="true" /> Solicitudes pendientes
            </div>
            {pendientes.length === 0 && (
              <div style={{ fontSize: 13, color: '#888', padding: '0.5rem 0' }}>
                No hay solicitudes pendientes.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendientes.map(p => (
                <div key={p.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.07)', paddingBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 13 }}>{p.nombre}</strong>
                    <span className={`badge ${tipoBadge(p.tipo)}`}>{tipoLabel(p.tipo)}</span>
                    {p.conCert && <span className="badge" style={{ background: '#f5f5f3', color: '#555' }}>Con certificado</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                    {formatFecha(p.desde)} → {formatFecha(p.hasta)} · {p.dias} días hábiles
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleAprobar(p.id)}>Aprobar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRechazar(p.id)}>Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
