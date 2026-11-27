# COBOL Migrator — frontend

Interfaz web (React + Vite + Tailwind) del traductor de COBOL a Python. El backend y la explicación completa del
proyecto están en el README del backend.

## Qué hace

- **Pegar código** o **subir un archivo** `.cob`, `.cbl` o `.cobol` (también por arrastrar y soltar).
- Muestra el Python resultante con botones para **copiar** y **descargar**.
- Muestra los **avisos** del backend ("Review before using"): qué construcciones requieren revisión, qué quedó sin
  traducir (el programa se detiene ahí con `NotImplementedError`) y qué modelo hizo la traducción.
- Permite **cancelar** una traducción en curso. Los programas grandes se traducen por partes y pueden tardar varios minutos
  (el frontend espera hasta 16).

## Uso

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev               # http://localhost:5173
```

El backend debe estar corriendo. `.env` solo necesita la dirección del servidor:

```ini
VITE_API_URL=http://localhost:3000
```

> Nunca pongas claves secretas en variables `VITE_*`: quedan visibles en el navegador.

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # compilación para producción
npm run lint     # ESLint
```

## Estructura

```
src/
  lib/api.js          todas las llamadas al backend (URL, timeout, cancelación, errores)
  lib/warnings.js     textos de cada código de aviso del backend
  lib/files.js        copiar y descargar
  components/ui/      editor, panel de resultado, avisos, modos de entrada
  pages/Main.jsx
```

Si el backend agrega un código de aviso nuevo, hay que agregarle su texto en `lib/warnings.js`; si no, en modo archivo
se vería el código en bruto.
