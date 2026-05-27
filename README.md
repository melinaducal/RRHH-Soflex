# LicenciasPro — Frontend

Sistema de gestión de licencias y turnos rotativos para RRHH.

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

En `vite.config.js` está el proxy configurado:

```js
proxy: {
  '/api': {
    target: 'http://localhost:8000', // ← cambiá por la URL de tu backend
    changeOrigin: true,
  },
},
```

Si el backend está en otro dominio (producción), podés definir la variable de entorno:

```bash
# .env
VITE_API_URL=https://tu-backend.com/api
```

---

## Estructura del proyecto

```
src/
├── App.jsx                 # Router principal
├── main.jsx                # Entry point
├── styles.css              # Estilos globales y design tokens
├── components/
│   ├── Sidebar.jsx         # Navegación lateral
│   └── Topbar.jsx          # Barra superior por página
├── pages/
│   ├── Dashboard.jsx       # Resumen del día + aprobaciones
│   ├── Calendario.jsx      # Calendario mensual de ausencias
│   ├── Licencias.jsx       # Formulario + historial de licencias
│   ├── Turnos.jsx          # Vista semanal de turnos rotativos
│   ├── Usuarios.jsx        # Listado de empleados
│   └── NuevoUsuario.jsx    # Alta de empleado
├── services/
│   └── api.js              # Capa REST: empleados, licencias, turnos, auth
└── utils/
    └── vacaciones.js       # Cálculo LCT, días hábiles, helpers
```

---

## Conectar con el backend

Todos los datos de ejemplo (mock) están en cada página. Para activar las
llamadas reales, descomentá los bloques `useEffect` marcados con:

```js
// Descomentar para datos reales:
// useEffect(() => { ... }, [])
```

Y eliminá la línea `setEstado(MOCK_...)` correspondiente.

---

## Endpoints esperados del backend

| Método | URL                          | Descripción                       |
|--------|------------------------------|-----------------------------------|
| GET    | /api/empleados               | Lista de empleados                |
| POST   | /api/empleados               | Crear empleado                    |
| GET    | /api/licencias               | Lista (filtros: estado, fecha)    |
| POST   | /api/licencias               | Crear solicitud                   |
| PATCH  | /api/licencias/:id/aprobar   | Aprobar solicitud                 |
| PATCH  | /api/licencias/:id/rechazar  | Rechazar solicitud                |
| GET    | /api/turnos                  | Turnos (filtros: empleadoId, semana) |
| POST   | /api/turnos                  | Crear/actualizar turno            |
| GET    | /api/dashboard/resumen       | Métricas del día                  |
| GET    | /api/calendario/ausencias    | Ausencias por mes                 |
| POST   | /api/auth/login              | Login — devuelve JWT              |

---

## Cálculo de vacaciones (LCT art. 150)

Implementado en `src/utils/vacaciones.js`:

| Antigüedad      | Días hábiles |
|-----------------|-------------|
| Menos de 5 años | 14          |
| 5 a 9 años      | 21          |
| 10 a 19 años    | 28          |
| 20 años o más   | 35          |

---

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para deployar en cualquier hosting estático
(Nginx, Vercel, Netlify, S3, etc.).