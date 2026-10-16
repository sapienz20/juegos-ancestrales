# Juegos Ancestrales e Interculturales · App Android

Esta es la app construida a partir del prototipo de Figma. Incluye el registro, el perfil con 21 avatares, los cuatro juegos (Bodoquera, Trompo de fuete, Palmo o cacha y Zumbambico) con sus 24 niveles de Retosaberes, y las secciones Logros, Mediateca, Memoria y Comunidad.

El progreso se guarda en el teléfono: al completar niveles suben los saberes, el recorrido y las insignias.

## Cómo obtener el APK

### Opción A · GitHub (no hay que instalar nada)

1. Crea un repositorio en GitHub y sube todo el contenido de esta carpeta.
2. GitHub compila el APK solo (tarda unos 6 minutos). Míralo en la pestaña **Actions**.
3. Abre la última ejecución de «Compilar APK» y descarga **juegos-ancestrales-apk** en la sección *Artifacts*.
4. Descomprime el archivo, pasa `app-debug.apk` al teléfono y ábrelo. Android pedirá permitir «instalar apps de origen desconocido».

Cada vez que cambies algo y lo subas, GitHub genera un APK nuevo. También puedes lanzarlo a mano con el botón **Run workflow**.

### Opción B · En tu computador con Android Studio

Necesitas [Node.js 20](https://nodejs.org) y [Android Studio](https://developer.android.com/studio).

```bash
npm install
npm run build
npm run android:add      # crea la carpeta android y agrega permisos de micrófono y cámara
npx cap sync android
npm run android:open     # abre el proyecto en Android Studio
```

En Android Studio: menú **Build › Build App Bundle(s) / APK(s) › Build APK(s)**. El archivo queda en `android/app/build/outputs/apk/debug/`.

Para publicar en Google Play se necesita un APK firmado (**Build › Generate Signed App Bundle / APK**) y una cuenta de desarrollador.

## Probar en el navegador

```bash
npm install
npm run dev              # abre http://localhost:5173
```

## Dónde se cambia el contenido

| Qué | Archivo |
| --- | --- |
| Preguntas, respuestas, textos y colores de cada juego | `src/data.ts` |
| Imágenes (mapas, vivencias, fondos, avatares) | `public/img/` |
| Ícono y pantalla de inicio de la app | `assets/icon-only.png`, `assets/splash.png` |
| Estilos y colores generales | `src/styles.css` |

En `src/data.ts` las líneas marcadas con **POR VALIDAR** tienen respuestas que hay que confirmar con la comunidad. Las marcadas con **POR REEMPLAZAR** usan imágenes de otro juego.

## Pendiente para la siguiente versión

- **Contenido real:** cargar los videos de Origen y Creando, los audios del nivel Escucha el sonido y el canto, y las ilustraciones propias de cada juego.
- **Comunidad entre teléfonos:** hoy las publicaciones y las fotos se guardan solo en el teléfono. Para compartirlas hace falta un servidor (por ejemplo Firebase o Supabase) y alguien que modere.
- **Cuentas:** el registro funciona sin internet y vive en el teléfono. Si se borran los datos de la app, se pierde el progreso.
