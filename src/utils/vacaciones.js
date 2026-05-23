/* ============================================================
   utils/vacaciones.js
   Cálculo de días de vacaciones según la Ley de Contrato de
   Trabajo argentina (art. 150, Ley 20.744).
   ============================================================ */

/**
 * Calcula la antigüedad en años completos de un empleado.
 * @param {string|Date} fechaIngreso
 * @returns {number} años completos
 */
export function calcularAntiguedad(fechaIngreso) {
  const ingreso = new Date(fechaIngreso)
  const hoy = new Date()
  let anios = hoy.getFullYear() - ingreso.getFullYear()
  const m = hoy.getMonth() - ingreso.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < ingreso.getDate())) anios--
  return Math.max(0, anios)
}

/**
 * Devuelve los días de vacaciones correspondientes según LCT.
 * @param {number} anios - antigüedad en años
 * @returns {{ dias: number, descripcion: string }}
 */
export function diasVacacionesLCT(anios) {
  if (anios < 5)  return { dias: 14, descripcion: 'Menos de 5 años de antigüedad' }
  if (anios < 10) return { dias: 21, descripcion: 'De 5 a 9 años de antigüedad' }
  if (anios < 20) return { dias: 28, descripcion: 'De 10 a 19 años de antigüedad' }
  return               { dias: 35, descripcion: '20 años o más de antigüedad' }
}

/**
 * Calcula días hábiles entre dos fechas (excluyendo sábados y domingos).
 * @param {string|Date} desde
 * @param {string|Date} hasta
 * @returns {number}
 */
export function calcularDiasHabiles(desde, hasta) {
  const ini = new Date(desde)
  const fin = new Date(hasta)
  let count = 0
  const cur = new Date(ini)
  while (cur <= fin) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

/**
 * Días totales (corridos) entre dos fechas, inclusive.
 */
export function calcularDiasCorridos(desde, hasta) {
  const ini = new Date(desde)
  const fin = new Date(hasta)
  return Math.round((fin - ini) / (1000 * 60 * 60 * 24)) + 1
}

/**
 * Formatea una fecha ISO a dd/mm/aaaa
 */
export function formatFecha(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-AR')
}

/**
 * Iniciales de un nombre completo
 */
export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

/** Tipos de licencia disponibles */
export const TIPOS_LICENCIA = [
  { value: 'vacaciones',   label: 'Vacaciones',              badge: 'badge-vac', requiereCert: false },
  { value: 'enfermedad',   label: 'Enfermedad',              badge: 'badge-enf', requiereCert: true  },
  { value: 'maternidad',   label: 'Maternidad / Paternidad', badge: 'badge-mat', requiereCert: true  },
  { value: 'estudio',      label: 'Días de estudio',         badge: 'badge-est', requiereCert: false },
  { value: 'duelo',        label: 'Duelo',                   badge: 'badge-duo', requiereCert: false },
  { value: 'otro',         label: 'Otro',                    badge: 'badge-otro',requiereCert: false },
]

export const ROLES = [
  { value: 'empleado',    label: 'Empleado' },
  { value: 'supervisor',  label: 'Supervisor / Jefe' },
  { value: 'rrhh',        label: 'RRHH' },
  { value: 'admin',       label: 'Socio / Administrador' },
]

export const MODALIDADES = [
  { value: 'fijo',    label: 'Horario fijo' },
  { value: 'rotativo',label: 'Turno rotativo' },
]

export const TURNOS_TIPOS = {
  manana: { label: 'Mañana', horas: '6 – 14h',  clase: 'turno-manana' },
  tarde:  { label: 'Tarde',  horas: '14 – 22h', clase: 'turno-tarde'  },
  noche:  { label: 'Noche',  horas: '22 – 6h',  clase: 'turno-noche'  },
  franco: { label: 'Franco', horas: '',          clase: 'turno-franco' },
}

export const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
export const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
