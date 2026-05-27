# RRHH Soflex — Frontend

Sistema de gestión de licencias y turnos rotativos para RRHH, desarrollado para Soflex.

## Stack

- **React 18** + **Vite 5**
- **React Router v6** — navegación entre páginas
- **Tabler Icons** — iconografía
- Sin librerías de UI externas — estilos propios en `src/styles.css`

---

## Instalación

```bash
npm install
npm run dev
```

La app corre en `http://localhost:3000`.

---

## Configuración del backend

La URL base del backend está en `src/services/api.js`:

```js
const BASE_URL = 'http://localhost:8010/proxy'
```

---

## Proxy CORS (desarrollo local)

El backend requiere un proxy para evitar errores de CORS en desarrollo. Instalarlo una sola vez:

```bash
npm install -g local-cors-proxy
```

Levantarlo antes de usar la app:

```bash
lcp --proxyUrl https://devptt.soflex.com.ar
```

Esto crea un proxy en `http://localhost:8010/proxy` que redirige todas las llamadas al servidor real.

---

## Estructura del proyecto

```
src/
├── App.jsx                 # Router principal y control del sidebar
├── AppContext.jsx          # Contexto global (estado del sidebar)
├── main.jsx                # Entry point
├── styles.css              # Estilos globales y design tokens
├── components/
│   ├── Sidebar.jsx         # Navegación lateral con hamburguesa mobile
│   └── Topbar.jsx          # Barra superior por página
├── pages/
│   ├── Dashboard.jsx       # Resumen del día + aprobaciones
│   ├── Calendario.jsx      # Calendario mensual de ausencias
│   ├── Licencias.jsx       # Formulario + historial de licencias
│   ├── Login.jsx           # Pantalla de login
│   ├── Turnos.jsx          # Vista semanal de turnos rotativos
│   ├── Usuarios.jsx        # Listado de empleados
│   └── NuevoUsuario.jsx    # Alta de empleado
├── services/
│   └── api.js              # Capa REST — autenticación y formularios
└── utils/
    └── vacaciones.js       # Cálculo LCT, días hábiles, helpers
```

---

## Autenticación

El login usa **Basic Auth** contra el endpoint `/auth/sesion`. El servidor devuelve un JWT que se guarda en `sessionStorage` y se manda como `Bearer Token` en todos los requests siguientes.

---

## Endpoints del backend

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | /auth/sesion | Login con Basic Auth — devuelve JWT |
| GET | /formularios/formularios | Lista de formularios disponibles |
| GET | /formularios/formulario-valores/paginado | Licencias cargadas (filtrar por formID) |
| POST | /formularios/formulario-valores | Crear nueva licencia |
| PUT | /formularios/formulario-valores | Modificar licencia |
| DELETE | /formularios/formulario-valores | Eliminar licencia |
| POST | /formularios/formulario-archivo | Subir certificado médico |
| GET | /formularios/formulario-archivos | Descargar certificado |

---

## IDs de formularios

| FormularioID | Tipo |
|---|---|
| 87 | Solicitud Licencia Anual |
| 89 | Solicitud Licencia Extraordinaria |
| 90 | Solicitud Días por Estudio |
| 91 | Modalidad de Trabajo |

---

## Cálculo de vacaciones (LCT art. 150)

Implementado en `src/utils/vacaciones.js`:

| Antigüedad | Días hábiles |
|---|---|
| Menos de 5 años | 14 |
| 5 a 9 años | 21 |
| 10 a 19 años | 28 |
| 20 años o más | 35 |

---

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para deployar en cualquier hosting estático (Nginx, Vercel, Netlify, etc.).