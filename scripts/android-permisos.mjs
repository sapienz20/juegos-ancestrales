// Agrega al proyecto Android los permisos de micrófono y cámara
// (responder con voz, enviar foto y grabar video en el nivel Crear).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = 'android/app/src/main/AndroidManifest.xml';
if (!existsSync(file)) {
  console.error('No existe la carpeta android. Ejecuta primero: npx cap add android');
  process.exit(1);
}
let xml = readFileSync(file, 'utf8');
const perms = ['android.permission.RECORD_AUDIO', 'android.permission.MODIFY_AUDIO_SETTINGS', 'android.permission.CAMERA'];
for (const p of perms) {
  if (!xml.includes(p)) xml = xml.replace('</manifest>', `    <uses-permission android:name="${p}" />\n</manifest>`);
}
writeFileSync(file, xml);
console.log('Permisos agregados:', perms.join(', '));
