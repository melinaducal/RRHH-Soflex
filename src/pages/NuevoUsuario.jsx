import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { empleados as empleadosApi } from '../services/api'
import { calcularAntiguedad, diasVacacionesLCT, ROLES, MODALIDADES } from '../utils/vacaciones'

const FORM_EMPTY = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  fechaIngreso: '',
  sector: '',
  rol: 'empleado',
  modalidad: 'fijo',
}

export default function NuevoUsuario() {
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_EMPTY)
  const [enviando, setEnviando] = useState(false)
  const [alerta, setAlerta] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const vacInfo = (() => {
    if (!form.fechaIngreso) return null
    const anios = calcularAntiguedad(form.fechaIngreso)
    return { anios, ...diasVacacionesLCT(anios) }
  })()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre || !form.apellido || !form.email || !form.fechaIngreso) {
      setAlerta({ tipo: 'error', msg: 'Completá todos los campos obligatorios.' })
      return
    }
    setEnviando(true)
    try {
      // await empleadosApi.create({ ...form, nombre: `${form.nombre} ${form.apellido}` })
      await new Promise(r => setTimeout(r, 600)) // Simular llamada
      setAlerta({ tipo: 'success', msg: `Empleado ${form.nombre} ${form.apellido} creado correctamente.` })
      setTimeout(() => navigate('/usuarios'), 1500)
    } catch (err) {
      setAlerta({ tipo: 'error', msg: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Topbar
        title="Nuevo empleado"
        actions={
          <button className="btn" onClick={() => navigate('/usuarios')}>
            <i className="ti ti-arrow-left" aria-hidden="true" /> Volver
          </button>
        }
      />
      <div className="page-content">

        {alerta && (
          <div className={`alert alert-${alerta.tipo === 'success' ? 'success' : 'error'}`}>
            <i className={`ti ${alerta.tipo === 'success' ? 'ti-circle-check' : 'ti-alert-circle'}`} aria-hidden="true" />
            {alerta.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-title">
              <i className="ti ti-user" aria-hidden="true" /> Datos personales
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre *</label>
                <input
                  type="text" id="nombre" name="nombre"
                  value={form.nombre} onChange={handleChange}
                  placeholder="Ej: María" required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="apellido">Apellido *</label>
                <input
                  type="text" id="apellido" name="apellido"
                  value={form.apellido} onChange={handleChange}
                  placeholder="Ej: García" required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="dni">DNI / CUIL</label>
                <input
                  type="text" id="dni" name="dni"
                  value={form.dni} onChange={handleChange}
                  placeholder="20-12345678-9"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email corporativo *</label>
                <input
                  type="email" id="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="nombre@empresa.com" required
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <i className="ti ti-building" aria-hidden="true" /> Datos laborales
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fechaIngreso">Fecha de ingreso *</label>
                <input
                  type="date" id="fechaIngreso" name="fechaIngreso"
                  value={form.fechaIngreso} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sector">Sector / Área</label>
                <input
                  type="text" id="sector" name="sector"
                  value={form.sector} onChange={handleChange}
                  placeholder="Ej: Producción, Logística..."
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="rol">Rol en el sistema</label>
                <select id="rol" name="rol" value={form.rol} onChange={handleChange}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="modalidad">Modalidad de trabajo</label>
                <select id="modalidad" name="modalidad" value={form.modalidad} onChange={handleChange}>
                  {MODALIDADES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>

            {/* Cálculo de vacaciones en tiempo real */}
            {vacInfo && (
              <div className="info-box">
                <strong>
                  <i className="ti ti-sun" aria-hidden="true" style={{ marginRight: 6 }} />
                  Días de vacaciones según LCT (Ley 20.744)
                </strong>
                <div style={{ marginTop: 4 }}>
                  <strong style={{ fontSize: 20 }}>{vacInfo.dias}</strong>
                  <span style={{ marginLeft: 6 }}>días hábiles</span>
                </div>
                <div style={{ marginTop: 4, opacity: 0.85 }}>
                  {vacInfo.descripcion} · Antigüedad: {vacInfo.anios} año{vacInfo.anios !== 1 ? 's' : ''}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                  Art. 150, Ley de Contrato de Trabajo: menos de 5 años → 14 días · 5–9 años → 21 días · 10–19 años → 28 días · 20+ años → 35 días
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '0.5rem' }}>
            <button type="button" className="btn" onClick={() => navigate('/usuarios')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              <i className="ti ti-user-check" aria-hidden="true" />
              {enviando ? 'Guardando...' : 'Crear empleado'}
            </button>
          </div>
        </form>

      </div>
    </>
  )
}
