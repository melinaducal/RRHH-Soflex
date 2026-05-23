import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import { turnos as turnosApi, empleados as empleadosApi } from '../services/api'
import { TURNOS_TIPOS, DIAS_SEMANA } from '../utils/vacaciones'

const MOCK_EMPLEADOS = [
  { id:1, nombre:'A. López',     sector:'Producción' },
  { id:2, nombre:'J. Fernández', sector:'Depósito' },
  { id:3, nombre:'P. Romero',    sector:'Logística' },
  { id:4, nombre:'D. Soria',     sector:'Depósito' },
]

// Turnos indexados por empleadoId > semana > [7 días]
const MOCK_TURNOS = {
  1: { '2026-W21': ['manana','tarde','tarde','noche','noche','franco','franco'] },
  2: { '2026-W21': ['franco','manana','manana','tarde','tarde','noche','franco'] },
  3: { '2026-W21': ['tarde','franco','manana','manana','franco','tarde','noche'] },
  4: { '2026-W21': ['noche','noche','franco','manana','tarde','tarde','franco'] },
}

function semanaLabel(semana) {
  // semana = '2026-W21'
  const [anio, w] = semana.split('-W')
  const lunes = isoWeekToDate(parseInt(anio), parseInt(w))
  const dom = new Date(lunes); dom.setDate(lunes.getDate() + 6)
  return `${lunes.toLocaleDateString('es-AR', { day:'2-digit', month:'short' })} – ${dom.toLocaleDateString('es-AR', { day:'2-digit', month:'short' })}`
}

function isoWeekToDate(year, week) {
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7
  const startOfWeek1 = new Date(jan4)
  startOfWeek1.setDate(jan4.getDate() - jan4Day + 1)
  const result = new Date(startOfWeek1)
  result.setDate(startOfWeek1.getDate() + (week - 1) * 7)
  return result
}

function diasSemana(semana) {
  const [anio, w] = semana.split('-W')
  const lunes = isoWeekToDate(parseInt(anio), parseInt(w))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes); d.setDate(lunes.getDate() + i)
    return d.toLocaleDateString('es-AR', { weekday:'short', day:'2-digit' })
  })
}

function contarTurnos(lista = []) {
  const counts = { manana:0, tarde:0, noche:0, franco:0 }
  lista.forEach(t => { if (counts[t] !== undefined) counts[t]++ })
  return counts
}

export default function Turnos() {
  const hoy = new Date()
  const anioHoy = hoy.getFullYear()
  const semHoy = getISOWeek(hoy)
  const semanaDefault = `${anioHoy}-W${String(semHoy).padStart(2,'0')}`

  const [empleados, setEmpleados] = useState(MOCK_EMPLEADOS)
  const [empId, setEmpId] = useState(1)
  const [semana, setSemana] = useState(semanaDefault)
  const [turnosData, setTurnosData] = useState(MOCK_TURNOS)

  // Descomentar para datos reales:
  // useEffect(() => {
  //   empleadosApi.list({ modalidad: 'rotativo' }).then(setEmpleados)
  // }, [])
  // useEffect(() => {
  //   turnosApi.list({ empleadoId: empId, semana }).then(data => {
  //     setTurnosData(prev => ({ ...prev, [empId]: { ...prev[empId], [semana]: data.turnos } }))
  //   })
  // }, [empId, semana])

  const turnosSemana = turnosData[empId]?.[semana] || Array(7).fill(null)
  const diasLabels = diasSemana(semana)
  const counts = contarTurnos(turnosSemana)
  const empleado = empleados.find(e => e.id === empId)

  return (
    <>
      <Topbar title="Turnos rotativos" />
      <div className="page-content">

        {/* Selector */}
        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 200 }}>
              <label className="form-label" htmlFor="empleado-sel">Empleado</label>
              <select
                id="empleado-sel"
                value={empId}
                onChange={e => setEmpId(Number(e.target.value))}
              >
                {empleados.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} — {e.sector}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="semana-sel">Semana</label>
              <input
                type="week" id="semana-sel"
                value={semana}
                onChange={e => setSemana(e.target.value)}
              />
            </div>
          </div>

          {empleado && (
            <div style={{ fontSize: 13, color: '#666', marginBottom: '1rem' }}>
              <i className="ti ti-calendar-week" aria-hidden="true" style={{ marginRight: 6 }} />
              Semana {semanaLabel(semana)}
            </div>
          )}

          <div className="legend">
            {Object.entries(TURNOS_TIPOS).map(([k, v]) => (
              <div className="legend-item" key={k}>
                <div className="legend-dot" style={{
                  background: k==='manana'?'var(--amber-400)':k==='tarde'?'var(--blue-400)':k==='noche'?'#2c2c2a':'var(--green-400)'
                }} />
                {v.label}{v.horas ? ` (${v.horas})` : ''}
              </div>
            ))}
          </div>

          {/* Grilla de turnos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {diasLabels.map(d => (
              <div key={d} style={{ fontSize: 11, color: '#888', textAlign: 'center', paddingBottom: 4, fontWeight: 500 }}>
                {d}
              </div>
            ))}
            {turnosSemana.map((t, i) => {
              const info = t ? TURNOS_TIPOS[t] : null
              return (
                <div
                  key={i}
                  className={`turno-slot ${t ? 'turno-' + t : ''}`}
                  style={!t ? { background: '#f5f5f3', color: '#bbb', fontSize: 11 } : {}}
                >
                  {info ? (
                    <>
                      <div style={{ fontWeight: 500 }}>{info.label}</div>
                      {info.horas && <div className="turno-hr">{info.horas}</div>}
                    </>
                  ) : '—'}
                </div>
              )
            })}
          </div>
        </div>

        {/* Resumen */}
        <div className="card">
          <div className="card-title">
            <i className="ti ti-chart-bar" aria-hidden="true" /> Resumen de la semana
          </div>
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="stat-card">
              <div className="stat-label">Mañana</div>
              <div className="stat-value" style={{ color: 'var(--amber-400)' }}>{counts.manana}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tarde</div>
              <div className="stat-value" style={{ color: 'var(--blue-400)' }}>{counts.tarde}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Noche</div>
              <div className="stat-value" style={{ color: '#2c2c2a' }}>{counts.noche}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Franco</div>
              <div className="stat-value" style={{ color: 'var(--green-400)' }}>{counts.franco}</div>
            </div>
          </div>
        </div>

        {/* Vista grupal */}
        <div className="card">
          <div className="card-title">
            <i className="ti ti-users" aria-hidden="true" /> Vista grupal — {semanaLabel(semana)}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  {diasLabels.map(d => <th key={d} style={{ textAlign: 'center' }}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {empleados.map(e => {
                  const ts = turnosData[e.id]?.[semana] || Array(7).fill(null)
                  return (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{e.nombre}</td>
                      {ts.map((t, i) => {
                        const info = t ? TURNOS_TIPOS[t] : null
                        return (
                          <td key={i} style={{ textAlign: 'center', padding: '6px 4px' }}>
                            {info
                              ? <span className={`badge ${t==='manana'?'badge-pen':t==='tarde'?'badge-est':t==='noche'?'':'badge-act'}`}
                                  style={t==='noche'?{background:'#2c2c2a',color:'#fff'}:{}}
                                >
                                  {info.label}
                                </span>
                              : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>
                            }
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}
