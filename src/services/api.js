/* ============================================================
   services/api.js
   Autenticación: POST /auth/sesion con Basic Auth → JWT
   El token se guarda en sessionStorage y se manda como Bearer
   en todos los requests siguientes.
   ============================================================ */

const BASE_URL = 'https://devptt.soflex.com.ar'
const TOKEN_KEY = 'lp_token'

// ── Token helpers ──────────────────────────────────────────
function getToken()        { return sessionStorage.getItem(TOKEN_KEY) }
function setToken(token)   { sessionStorage.setItem(TOKEN_KEY, token) }
function clearToken()      { sessionStorage.removeItem(TOKEN_KEY) }
export  function isLoggedIn() { return !!getToken() }

// ── Request base ───────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Token expirado → limpiar y recargar
  if (res.status === 401) {
    clearToken()
    window.location.href = '/login'
    throw new Error('Sesión expirada. Iniciá sesión nuevamente.')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Error ${res.status}`)
  }

  return res.status === 204 ? null : res.json()
}

// ── Auth ───────────────────────────────────────────────────
export const auth = {
  /**
   * Login con Basic Auth.
   * @param {string} usuario
   * @param {string} password
   * @returns {Promise<string>} el token JWT
   */
  async login(usuario, password) {
    const credenciales = btoa(`${usuario}:${password}`)   // Base64

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

    // El backend devuelve el token — ajustá la key si es distinta
    const token = data.token || data.access_token || data.jwt
    if (!token) throw new Error('El servidor no devolvió un token.')

    setToken(token)
    return token
  },

  logout() {
    clearToken()
    window.location.href = '/login'
  },
}

// ---- Empleados ----
export const empleados = {
  list:   ()          => request('/empleados'),
  get:    (id)        => request(`/empleados/${id}`),
  create: (data)      => request('/empleados',     { method: 'POST',  body: JSON.stringify(data) }),
  update: (id, data)  => request(`/empleados/${id}`, { method: 'PUT',   body: JSON.stringify(data) }),
  delete: (id)        => request(`/empleados/${id}`, { method: 'DELETE' }),
}

// ---- Licencias ----
export const licencias = {
  list:     (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/licencias${q ? '?' + q : ''}`)
  },
  get:      (id)          => request(`/licencias/${id}`),
  create:   (data)        => request('/licencias',       { method: 'POST',  body: JSON.stringify(data) }),
  aprobar:  (id)          => request(`/licencias/${id}/aprobar`,  { method: 'PATCH' }),
  rechazar: (id, motivo)  => request(`/licencias/${id}/rechazar`, { method: 'PATCH', body: JSON.stringify({ motivo }) }),
  delete:   (id)          => request(`/licencias/${id}`, { method: 'DELETE' }),
}

// ---- Turnos ----
export const turnos = {
  list:   (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/turnos${q ? '?' + q : ''}`)
  },
  get:    (id)         => request(`/turnos/${id}`),
  create: (data)       => request('/turnos',      { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)   => request(`/turnos/${id}`, { method: 'PUT',  body: JSON.stringify(data) }),
  delete: (id)         => request(`/turnos/${id}`, { method: 'DELETE' }),
}

// ---- Dashboard ----
export const dashboard = {
  resumen: () => request('/dashboard/resumen'),
  // Esperado: { empleadosActivos, conLicenciaHoy, solicitudesPendientes, turnosSemana }
}

// ---- Calendario ----
export const calendario = {
  ausencias: (anio, mes) => request(`/calendario/ausencias?anio=${anio}&mes=${mes}`),
  // Esperado: array de { empleadoId, nombre, tipo, fechaDesde, fechaHasta }
}

export default { auth, empleados, licencias, turnos, dashboard, calendario }