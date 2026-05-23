import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import { calendario as calendarioApi } from '../services/api'
import { formatFecha, iniciales, TIPOS_LICENCIA, MESES } from '../utils/vacaciones'

const MOCK_AUSENCIAS = [
  { id:1, nombre:'E. Zarate',     tipo:'vacaciones', desde:'2026-05-12', hasta:'2026-05-30' },
  { id:2, nombre:'F. Perla',   tipo:'maternidad', desde:'2026-04-01', hasta:'2026-08-15' },
  { id:3, nombre:'M. Ducal',tipo:'enfermedad', desde:'2026-05-18', hasta:'2026-05-21' },
  { id:4, nombre:'I. Lamas',   tipo:'vacaciones', desde:'2026-05-19', hasta:'2026-05-25' },
  { id:5, nombre:'J. Sotelo',    tipo:'estudio',    desde:'2026-05-18', hasta:'2026-05-18' },
]

function tipoBadge(tipo) {
  return TIPOS_LICENCIA.find(t => t.value === tipo)?.badge || 'badge-otro'
}
function tipoLabel(tipo) {
  return TIPOS_LICENCIA.find(t => t.value === tipo)?.label || tipo
}

const LEGEND = [
  { color: 'var(--teal-400)',  label: 'Vacaciones' },
  { color: 'var(--pink-400)',  label: 'Maternidad' },
  { color: 'var(--amber-400)', label: 'Enfermedad' },
  { color: 'var(--blue-400)',  label: 'Estudio' },
]

function diasConEvento(ausencias, anio, mes) {
  const dias = new Set()
  ausencias.forEach(a => {
    const desde = new Date(a.desde)
    const hasta = new Date(a.hasta)
    const cur = new Date(desde)
    while (cur <= hasta) {
      if (cur.getFullYear() === anio && cur.getMonth() === mes) {
        dias.add(cur.getDate())
      }
      cur.setDate(cur.getDate() + 1)
    }
  })
  return dias
}

export default function Calendario() {
  const hoy = new Date()
  const [calDate, setCalDate] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
  const [ausencias, setAusencias] = useState(MOCK_AUSENCIAS)
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  // Descomentar para datos reales:
  // useEffect(() => {
  //   calendarioApi.ausencias(calDate.getFullYear(), calDate.getMonth() + 1)
  //     .then(setAusencias)
  // }, [calDate])

  const anio = calDate.getFullYear()
  const mes  = calDate.getMonth()
  const eventDias = diasConEvento(ausencias, anio, mes)
  const daysInMonth = new Date(anio, mes + 1, 0).getDate()
  let startDay = new Date(anio, mes, 1).getDay()
  startDay = startDay === 0 ? 6 : startDay - 1
  const prevDays = new Date(anio, mes, 0).getDate()

  function changeMonth(dir) {
    setCalDate(d => new Date(d.getFullYear(), d.getMonth() + dir, 1))
    setDiaSeleccionado(null)
  }

  const ausenciasDia = diaSeleccionado
    ? ausencias.filter(a => {
        const d = new Date(anio, mes, diaSeleccionado)
        return d >= new Date(a.desde) && d <= new Date(a.hasta)
      })
    : []

  const ausenciasMes = ausencias.filter(a => {
    const desde = new Date(a.desde)
    const hasta = new Date(a.hasta)
    const primerDia = new Date(anio, mes, 1)
    const ultimoDia = new Date(anio, mes + 1, 0)
    return desde <= ultimoDia && hasta >= primerDia
  })

  return (
    <>
      <Topbar title="Calendario de ausencias" />
      <div className="page-content">

        <div className="legend">
          {LEGEND.map(l => (
            <div className="legend-item" key={l.label}>
              <div className="legend-dot" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        <div className="two-col" style={{ alignItems: 'start' }}>
          {/* Calendario */}
          <div className="card">
            <div className="cal-nav">
              <button className="btn" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
                <i className="ti ti-chevron-left" aria-hidden="true" />
              </button>
              <div className="cal-month">{MESES[mes]} {anio}</div>
              <button className="btn" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
                <i className="ti ti-chevron-right" aria-hidden="true" />
              </button>
            </div>

            <div className="cal-grid">
              {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
                <div key={d} className="cal-header">{d}</div>
              ))}

              {/* Días del mes anterior */}
              {Array.from({ length: startDay }, (_, i) => (
                <div key={`prev-${i}`} className="cal-day other-month">
                  {prevDays - startDay + 1 + i}
                </div>
              ))}

              {/* Días del mes */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dia = i + 1
                const esHoy = anio === hoy.getFullYear() && mes === hoy.getMonth() && dia === hoy.getDate()
                const tieneEvento = eventDias.has(dia)
                const seleccionado = diaSeleccionado === dia
                return (
                  <div
                    key={dia}
                    className={`cal-day${esHoy ? ' today' : ''}${tieneEvento ? ' has-event' : ''}`}
                    onClick={() => setDiaSeleccionado(seleccionado ? null : dia)}
                    style={seleccionado && !esHoy ? { background: 'var(--blue-50)', fontWeight: 500 } : {}}
                    title={tieneEvento ? 'Hay ausencias este día' : ''}
                  >
                    {dia}
                  </div>
                )
              })}
            </div>

            {diaSeleccionado && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 8 }}>
                  Ausencias el {diaSeleccionado}/{mes + 1}/{anio}
                </div>
                {ausenciasDia.length === 0
                  ? <div style={{ fontSize: 13, color: '#888' }}>Nadie ausente este día.</div>
                  : ausenciasDia.map(a => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div className="avatar avatar-sm">{iniciales(a.nombre)}</div>
                        <span style={{ fontSize: 13, flex: 1 }}>{a.nombre}</span>
                        <span className={`badge ${tipoBadge(a.tipo)}`}>{tipoLabel(a.tipo)}</span>
                      </div>
                    ))
                }
              </div>
            )}
          </div>

          {/* Tabla de ausencias del mes */}
          <div className="card">
            <div className="card-title">
              <i className="ti ti-list" aria-hidden="true" /> Ausencias este mes
            </div>
            {ausenciasMes.length === 0
              ? <div style={{ fontSize: 13, color: '#888' }}>Sin ausencias registradas.</div>
              : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Empleado</th>
                        <th>Tipo</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ausenciasMes.map(a => {
                        const dias = Math.round((new Date(a.hasta) - new Date(a.desde)) / (1000*60*60*24)) + 1
                        return (
                          <tr key={a.id}>
                            <td style={{ fontWeight: 500 }}>{a.nombre}</td>
                            <td><span className={`badge ${tipoBadge(a.tipo)}`}>{tipoLabel(a.tipo)}</span></td>
                            <td style={{ color: '#666' }}>{formatFecha(a.desde)}</td>
                            <td style={{ color: '#666' }}>{formatFecha(a.hasta)}</td>
                            <td>{dias}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
