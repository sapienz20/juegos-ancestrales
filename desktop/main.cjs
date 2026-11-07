// Versión de escritorio (Windows): abre la app en una ventana, con el tamaño de un celular centrado.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function crearVentana() {
  win = new BrowserWindow({
    width: 1100,
    height: 900,
    minWidth: 460,
    minHeight: 640,
    backgroundColor: '#7fb9ec',
    title: 'Juegos Ancestrales',
    icon: path.join(__dirname, 'web', 'img', 'logo.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  Menu.setApplicationMenu(null);
  // Los enlaces externos se abren en el navegador, no dentro del programa.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.loadFile(path.join(__dirname, 'web', 'escritorio.html'));
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
app.whenReady().then(crearVentana);
app.on('window-all-closed', () => app.quit());
