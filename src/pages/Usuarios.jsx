import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { empleados as empleadosApi } from '../services/api'
import { calcularAntiguedad, diasVacacionesLCT, iniciales, formatFecha, ROLES } from '../utils/vacaciones'

const MOCK_EMPLEADOS = [
  { id:1, nombre:'E. Zarate',     ingreso:'2018-03-10', sector:'Desarrollo', rol:'jefe',    vacUsados:14 },
  { id:2, nombre:'F. Perla',   ingreso:'2025-07-01', sector:'QA',  rol:'QA',    vacUsados:0  },
  { id:3, nombre:'M. Ducal',ingreso:'2025-03-13', sector:'Administracion',   rol:'secretaria',  vacUsados:10 },
  { id:4, nombre:'I. Lamas',   ingreso:'2024-01-15', sector:'Desarrollo',  rol:'empleado',    vacUsados:5  },
  { id:5, nombre:'M.F. Gomez',    ingreso:'2020-09-03', sector:'Administracion', rol:'rrhh',        vacUsados:7  },
  { id:6, nombre:'J. Sotelo',  ingreso:'2023-06-20', sector:'Desarrollo',   rol:'empleado',    vacUsados:0  },
]

function rolLabel(rol) {
  return ROLES.find(r => r.value === rol)?.label || rol
}

export default function Usuarios() {
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState(MOCK_EMPLEADOS)
  const [busqueda, setBusqueda] = useState('')

  // Descomentar para datos reales:
  // useEffect(() => {
  //   empleadosApi.list().then(setEmpleados)
  // }, [])

  const filtrados = empleados.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.sector.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <Topbar
        title="Empleados"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/nuevo-usuario')}>
            <i className="ti ti-user-plus" aria-hidden="true" /> Nuevo empleado
          </button>
        }
      />
      <div className="page-content">

        <div className="card">
          {/* Buscador */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-search" aria-hidden="true" style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                color: '#aaa', fontSize: 16,
              }} />
              <input
                type="text"
                placeholder="Buscar por nombre o sector..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ paddingLeft: 34 }}
              />
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Sector</th>
                  <th>Rol</th>
                  <th>Ingreso</th>
                  <th>Antigüedad</th>
                  <th>Vacaciones</th>
                  <th>Disponibles</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(e => {
                  const anios = calcularAntiguedad(e.ingreso)
                  const { dias } = diasVacacionesLCT(anios)
                  const disponibles = Math.max(0, dias - e.vacUsados)
                  const pct = Math.round((e.vacUsados / dias) * 100)
                  const colores = {
                    empleado:   { bg: 'var(--blue-50)',   color: 'var(--blue-800)'  },
                    supervisor: { bg: 'var(--teal-50)',   color: 'var(--teal-800)'  },
                    rrhh:       { bg: 'var(--amber-50)',  color: 'var(--amber-800)' },
                    admin:      { bg: 'var(--coral-50)',  color: 'var(--coral-800)' },
                  }
                  const roleColor = colores[e.rol] || colores.empleado
                  return (
                    <tr key={e.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar avatar-sm">{iniciales(e.nombre)}</div>
                          <span style={{ fontWeight: 500 }}>{e.nombre}</span>
                        </div>
                      </td>
                      <td style={{ color: '#666' }}>{e.sector}</td>
                      <td>
                        <span className="badge" style={{ background: roleColor.bg, color: roleColor.color }}>
                          {rolLabel(e.rol)}
                        </span>
                      </td>
                      <td style={{ color: '#666' }}>{formatFecha(e.ingreso)}</td>
                      <td>{anios} año{anios !== 1 ? 's' : ''}</td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ fontSize: 12 }}>{e.vacUsados} / {dias} días</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 32, height: 32, borderRadius: '50%',
                          background: disponibles > 0 ? 'var(--teal-50)' : 'var(--red-50)',
                          color: disponibles > 0 ? 'var(--teal-800)' : 'var(--red-800)',
                          fontSize: 13, fontWeight: 500,
                        }}>
                          {disponibles}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filtrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: 13 }}>
              <i className="ti ti-search-off" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
              Sin resultados para "{busqueda}"
            </div>
          )}
        </div>

      </div>
    </>
  )
}
