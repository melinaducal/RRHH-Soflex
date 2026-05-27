
/* ============================================================
   services/api.js
   ============================================================ */
 
const BASE_URL = 'http://localhost:8010/proxy'
const TOKEN_KEY = 'lp_token'
 
// ── Token helpers ──────────────────────────────────────────
function getToken()      { return sessionStorage.getItem(TOKEN_KEY) }
function setToken(t)     { sessionStorage.setItem(TOKEN_KEY, t) }
function clearToken()    { sessionStorage.removeItem(TOKEN_KEY) }
export function isLoggedIn() { return !!getToken() }
 
// ── Request base ───────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE_URL}/formularios${path}`, { ...options, headers })
  if (res.status === 401) {
    clearToken()
    window.location.reload()
    throw new Error('Sesión expirada.')
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Error ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}
 
// ── Auth ───────────────────────────────────────────────────
export const auth = {
  async login(usuario, password) {
    const credenciales = btoa(`${usuario}:${password}`)
    const res = await fetch(`${BASE_URL}/auth/sesion`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credenciales}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Credenciales incorrectas')
    }
    const data = await res.json()
    const token = data.token || data.access_token || data.jwt
    if (!token) throw new Error('El servidor no devolvió un token.')
    setToken(token)
    return token
  },
  logout() {
    clearToken()
    window.location.reload()
  },
}
 
// ── Licencias ─────────────────────────────────────────────
export const licencias = {
  list: (formID, params = {}) => {
    const q = new URLSearchParams({ formID, size: 50, ...params }).toString()
    return request(`/formulario-valores/paginado?${q}`)
  },
  crear: (formID, valores) => request('/formulario-valores', {
    method: 'POST',
    body: JSON.stringify({ FormularioID: formID, Valores: JSON.stringify(valores) })
  }),
  modificar: (id, formID, valores) => request('/formulario-valores', {
    method: 'PUT',
    body: JSON.stringify({ FormularioValoresID: id, FormularioID: formID, Valores: JSON.stringify(valores) })
  }),
  eliminar: (id) => request(`/formulario-valores?FormularioValoresID=${id}`, { method: 'DELETE' }),
}
 
// ── IDs de formularios ────────────────────────────────────
export const FORM_IDS = {
  licenciaAnual: 87,
  licenciaExtraordinaria: 89,
  diasEstudio: 90,
  modalidadTrabajo: 91,
}
 
// ── Empleados ─────────────────────────────────────────────
export const empleados = {
  list:   ()         => request('/empleados'),
  get:    (id)       => request(`/empleados/${id}`),
  create: (data)     => request('/empleados', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/empleados/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)       => request(`/empleados/${id}`, { method: 'DELETE' }),
}
 
// ── Turnos ────────────────────────────────────────────────
export const turnos = {
  list:   (params = {}) => request(`/turnos?${new URLSearchParams(params)}`),
  get:    (id)          => request(`/turnos/${id}`),
  create: (data)        => request('/turnos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)    => request(`/turnos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)          => request(`/turnos/${id}`, { method: 'DELETE' }),
}
 
export default { auth, licencias, empleados, turnos }