# Frontend - NRC Checker

## Requisitos
- Node.js 20
- npm o pnpm

## Instalación
```bash
cd frontend
npm install
```

## Variables de entorno
Crea un archivo `.env.local` con:
```
VITE_API_URL=http://localhost:8000
```
Ajusta la URL según dónde esté corriendo el backend.

## Desarrollo
```bash
npm run dev
```
La aplicación estará en `http://localhost:5173`.

## Construcción
```bash
npm run build
```

## Despliegue en Netlify
- Sube el contenido del directorio `frontend`.
- Configura la variable `VITE_API_URL` en el panel de Netlify para apuntar al backend.
