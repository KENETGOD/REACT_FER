# Template React Base

Template base para aplicaciones React con Vite, Ant Design, React Router,
TanStack Query, Axios y Zustand. Incluye layout publico, layout interno con
aside, cliente HTTP centralizado y un modulo CRUD simulado como referencia.

## Requisitos

- Node.js 18 o superior
- npm

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Variables de entorno

Crear un archivo `.env` cuando se conecte a una API real:

```env
VITE_API_URL=https://api.example.com
```

`VITE_API_URL` es usado por `src/service/core/apiService.js`.

## Librerias incluidas

### Produccion

- `react`: libreria principal para construir la interfaz.
- `react-dom`: renderizado de React en el navegador.
- `vite`: tooling de desarrollo y build.
- `react-router-dom`: definicion de rutas y navegacion.
- `antd`: sistema de componentes UI.
- `@ant-design/icons`: iconos usados por botones, menu y vistas.
- `@ant-design/v5-patch-for-react-19`: compatibilidad de Ant Design con React 19.
- `@tanstack/react-query`: manejo de consultas, cache, invalidacion y mutaciones.
- `axios`: cliente HTTP base.
- `zustand`: estado global ligero para menu, loader, auth y configuracion visual.

### Desarrollo

- `@vitejs/plugin-react`: plugin oficial de React para Vite.
- `eslint`: analisis estatico del codigo.
- `@eslint/js`: reglas base de ESLint.
- `eslint-plugin-react-hooks`: validacion de reglas de hooks.
- `eslint-plugin-react-refresh`: reglas para Fast Refresh.
- `globals`: definiciones de variables globales para ESLint.
- `@types/react`: tipos de React.
- `@types/react-dom`: tipos de React DOM.

## Rutas existentes

### Rutas publicas con `LayoutAuth`

- `/`: pantalla principal publica (`HomeView`).

### Rutas internas con `LayoutBase`

- `/inicio`: pantalla interna de inicio con logo central.
- `/informacion`: catalogo informativo de tramites y sectores.
- `/ejemplo-crud`: modulo de referencia con CRUD completo simulado.

### Fallback

- `*`: cualquier ruta inexistente redirige a `/`.

## Estructura principal

- `src/App.jsx`: declaracion unica de rutas.
- `src/main.jsx`: providers globales: `QueryClientProvider`, `BrowserRouter`,
  `ConfigProvider` de Ant Design y `AntdApp`.
- `src/components/layouts/LayoutAuth.jsx`: layout publico con header/footer.
- `src/components/layouts/LayoutBase.jsx`: layout interno con header, aside y contenido.
- `src/components/menu/MenuComponent.jsx`: aside desktop.
- `src/components/menu/Sidebar.jsx`: menu lateral mobile.
- `src/utils/menuItems.jsx`: opciones activas del menu interno.
- `src/service/core/apiService.js`: cliente Axios unico del proyecto.
- `src/service/core/makePetitions.js`: helpers `get`, `post`, `put`, `patch`, `del`.
- `src/modules/crudExample`: ejemplo de modulo con TanStack Query + `apiService`.
- `src/assets/styles/components.css`: estilos compartidos de layout, header, footer,
  menu y componentes.
- `src/assets/styles/views.css`: estilos especificos de vistas.

## Cliente HTTP

El cliente unico esta en:

```txt
src/service/core/apiService.js
```

Incluye:

- `baseURL` por `VITE_API_URL`.
- Timeout global.
- Header `Content-Type`.
- Token Bearer desde `localStorage`.
- Manejo de `FormData`.
- Interceptor para sesion expirada y token invalido.

Para consumirlo directamente:

```js
import apiService from "@/service/core/apiService";

const response = await apiService.get("/usuarios");
```

Tambien existen helpers:

```js
import { get, post, put, patch, del } from "@/service";

const users = await get("/usuarios");
await post("/usuarios", { nombre: "Usuario" });
```

## Ejemplo CRUD con TanStack Query

Ruta:

```txt
/ejemplo-crud
```

Archivos:

- `src/modules/crudExample/CrudExampleView.jsx`: UI con tabla, formulario, editar y eliminar.
- `src/modules/crudExample/useCrudExample.js`: queries y mutations con TanStack Query.
- `src/modules/crudExample/crudExampleApi.js`: adapter simulado usando `apiService`.

Este modulo no depende de una API real. Simula respuestas con un adapter de Axios y
guarda datos en `localStorage`, pero conserva la misma forma de trabajo que se usaria
con endpoints reales.

Patron recomendado:

```js
const usersQuery = useQuery({
  queryKey: ["users"],
  queryFn: userApi.list,
});

const createMutation = useMutation({
  mutationFn: userApi.create,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
});
```

## Estado global

El template usa Zustand para estado global puntual:

- `src/store/menuStore.js`: estado del menu desktop/mobile.
- `src/store/loaderStore.js`: loader global.
- `src/store/useAuthStore.js`: datos de autenticacion.
- `src/store/headerStore.js`: configuracion de header.
- `src/store/footerStore.js`: configuracion de footer.
- `src/store/useInputDataStore.js`: estado auxiliar reutilizable.

## Estilos y tema

El tema base de Ant Design se configura en `src/main.jsx`.

Colores principales:

- Guinda: `#4D0621`
- Morado: `#6A0F49`
- Rosa: `#FFC3D0`
- Gris: `#f5f6f7`

Los estilos principales estan divididos en:

- `src/assets/styles/style.css`: resets, fuentes y variables globales.
- `src/assets/styles/layout.css`: reglas generales de layout.
- `src/assets/styles/components.css`: header, footer, menu y componentes.
- `src/assets/styles/views.css`: vistas publicas, internas y CRUD de ejemplo.

## Recomendaciones para mejorar el template

- Agregar una pagina `NotFound` en lugar de redirigir silenciosamente a `/`.
- Agregar una estrategia clara de autenticacion: login, refresh token, logout y guardas de rutas.
- Crear un modulo `features/` o `modules/` con una convencion fija por feature:
  `api`, `hooks`, `components`, `view`.
- Agregar tests con Vitest y React Testing Library para hooks y vistas criticas.
- Agregar MSW para mocks de API mas realistas durante desarrollo.
- Agregar validacion de formularios con Zod si los formularios empiezan a crecer.
- Agregar archivo `.env.example` con las variables necesarias.
- Agregar convencion de commits, lint-staged y pre-commit hooks.
- Documentar como crear una nueva ruta interna y como agregarla al aside.
- Agregar manejo de permisos por rol si el sistema tendra vistas restringidas.
