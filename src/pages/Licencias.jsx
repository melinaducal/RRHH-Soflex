import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import { licencias, FORM_IDS } from '../services/api'
import { TIPOS_LICENCIA, calcularDiasHabiles, calcularDiasCorridos, formatFecha } from '../utils/vacaciones'

/*const MOCK_EMPLEADOS = [
  { id:1, nombre:'E. Zarate' },
  { id:2, nombre:'F. Perla' },
  { id:3, nombre:'M. Ducal' },
  { id:4, nombre:'I. Lamas' },
  { id:5, nombre:'J. Sotelo' },
]

const MOCK_LICENCIAS = [
  { id:10, empleadoNombre:'E. Zarate',     tipo:'vacaciones', desde:'2026-05-12', hasta:'2026-05-30', estado:'aprobada',  dias:14 },
  { id:11, empleadoNombre:'F. Perla', tipo:'enfermedad', desde:'2026-05-18', hasta:'2026-05-21', estado:'aprobada',  dias:4  },
  { id:12, empleadoNombre:'M. Ducal',   tipo:'vacaciones', desde:'2026-06-01', hasta:'2026-06-15', estado:'pendiente', dias:10 },
  { id:13, empleadoNombre:'I. Lamas',    tipo:'enfermedad', desde:'2026-05-18', hasta:'2026-05-20', estado:'pendiente', dias:3  },
]*/

const ESTADO_BADGE = {
  aprobada:  'badge-act',
  pendiente: 'badge-pen',
  rechazada: 'badge-rej',
}

function tipoBadge(tipo) { return TIPOS_LICENCIA.find(t => t.value === tipo)?.badge || 'badge-otro' }
function tipoLabel(tipo) { return TIPOS_LICENCIA.find(t => t.value === tipo)?.label || tipo }

const FORM_EMPTY = {
  empleadoId: '',
  tipo: 'vacaciones',
  desde: '',
  hasta: '',
  observaciones: '',
  certificado: null,
}

export default function Licencias() {
  const [empleados, setEmpleados] = useState([])
  const [historial, setHistorial] = useState([])
  const [form, setForm] = useState(FORM_EMPTY)
  const [enviando, setEnviando] = useState(false)
  const [alerta, setAlerta] = useState(null)

  useEffect(() => {
  Promise.all([
    licencias.list(FORM_IDS.licenciaAnual),
    licencias.list(FORM_IDS.licenciaExtraordinaria),
    licencias.list(FORM_IDS.diasEstudio),
  ]).then(([anual, extraordinaria, estudio]) => {
    const todas = [
      ...anual.items,
      ...extraordinaria.items,
      ...estudio.items,
    ]
    setHistorial(todas)
  })
}, [])
  const tipoSeleccionado = TIPOS_LICENCIA.find(t => t.value === form.tipo)
  const requiereCert = tipoSeleccionado?.requiereCert || false

const hoy = new Date().toISOString().split('T')[0]
const maxFecha = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]

const diasInfo = (() => {
  if (!form.desde || !form.hasta) return null
  if (form.desde < hoy) return { error: 'La fecha de inicio no puede ser en el pasado.' }
  if (form.hasta > maxFecha) return { error: 'La fecha no puede ser mayor a 2 años desde hoy.' }
  if (new Date(form.hasta) < new Date(form.desde)) return { error: 'La fecha de fin debe ser posterior al inicio.' }
  const habiles  = calcularDiasHabiles(form.desde, form.hasta)
  const corridos = calcularDiasCorridos(form.desde, form.hasta)
  if (habiles > 365) return { error: 'La licencia no puede superar 365 días hábiles.' }
  return { habiles, corridos }
})()

  function handleChange(e) {
    const { name, value, files } = e.target
    setForm(f => ({ ...f, [name]: files ? files[0] : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.empleadoId) return mostrarAlerta('error', 'Seleccioná un empleado.')
    if (!form.desde || !form.hasta) return mostrarAlerta('error', 'Completá las fechas.')
    if (diasInfo?.error) return mostrarAlerta('error', diasInfo.error)

    setEnviando(true)
    try {
      // const nueva = await licenciasApi.create({ ...form, dias: diasInfo.habiles })
      // setHistorial(h => [nueva, ...h])
      const nueva = {
        id: Date.now(),
        empleadoNombre: empleados.find(e => String(e.id) === String(form.empleadoId))?.nombre || '',
        tipo: form.tipo,
        desde: form.desde,
        hasta: form.hasta,
        estado: 'pendiente',
        dias: diasInfo.habiles,
      }
      setHistorial(h => [nueva, ...h])
      setForm(FORM_EMPTY)
      mostrarAlerta('success', 'Solicitud enviada. Quedará pendiente de aprobación.')
    } finally {
      setEnviando(false)
    }
  }

  function mostrarAlerta(tipo, msg) {
    setAlerta({ tipo, msg })
    setTimeout(() => setAlerta(null), 4000)
  }

  return (
    <>
      <Topbar title="Licencias" />
      <div className="page-content">

        {alerta && (
          <div className={`alert alert-${alerta.tipo === 'success' ? 'success' : 'error'}`}>
            <i className={`ti ${alerta.tipo === 'success' ? 'ti-circle-check' : 'ti-alert-circle'}`} aria-hidden="true" />
            {alerta.msg}
          </div>
        )}

        {/* Formulario */}
        <div className="card">
          <div className="card-title">
            <i className="ti ti-file-plus" aria-hidden="true" /> Solicitar licencia
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="empleadoId">Empleado</label>
                <select id="empleadoId" name="empleadoId" value={form.empleadoId} onChange={handleChange} required>
                  <option value="">Seleccionar empleado...</option>
                  {empleados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tipo">Tipo de licencia</label>
                <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
                  {TIPOS_LICENCIA.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="desde">Fecha de inicio</label>
                <input type="date" id="desde" name="desde" value={form.desde} onChange={handleChange}
  min={hoy} max={maxFecha} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="hasta">Fecha de fin</label>
                <input type="date" id="hasta" name="hasta" value={form.hasta} onChange={handleChange}
  min={form.desde || hoy} max={maxFecha} required />
              </div>
            </div>

            {diasInfo && !diasInfo.error && (
              <div className="info-box" style={{ marginBottom: '1rem' }}>
                <strong>Días solicitados</strong>
                {diasInfo.habiles} días hábiles · {diasInfo.corridos} días corridos
              </div>
            )}
            {diasInfo?.error && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                <i className="ti ti-alert-circle" aria-hidden="true" /> {diasInfo.error}
              </div>
            )}

            {requiereCert && (
              <div className="form-group">
                <label className="form-label" htmlFor="certificado">Certificado médico</label>
                <label className="upload-zone" htmlFor="certificado">
                  <i className="ti ti-upload" aria-hidden="true" />
                  {form.certificado
                    ? <span style={{ color: 'var(--teal-800)' }}>{form.certificado.name}</span>
                    : 'Adjuntá el certificado médico (PDF o imagen)'
                  }
                  <input
                    type="file" id="certificado" name="certificado"
                    accept=".pdf,image/*" style={{ display: 'none' }}
                    onChange={handleChange}
                  />
                </label>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones" name="observaciones"
                value={form.observaciones} onChange={handleChange}
                placeholder="Detalle adicional o comentario..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={enviando}>
                <i className="ti ti-send" aria-hidden="true" />
                {enviando ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>

        {/* Historial */}
        <div className="card">
          <div className="card-title">
            <i className="ti ti-history" aria-hidden="true" /> Historial de licencias
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Tipo</th>
                  <th>Desde</th>
                  <th>Hasta</th>
                  <th>Días</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {historial.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 500 }}>{l.empleadoNombre}</td>
                    <td><span className={`badge ${tipoBadge(l.tipo)}`}>{tipoLabel(l.tipo)}</span></td>
                    <td style={{ color: '#666' }}>{formatFecha(l.desde)}</td>
                    <td style={{ color: '#666' }}>{formatFecha(l.hasta)}</td>
                    <td>{l.dias}</td>
                    <td>
                      <span className={`badge ${ESTADO_BADGE[l.estado] || 'badge-otro'}`}>
                        {l.estado.charAt(0).toUpperCase() + l.estado.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}
