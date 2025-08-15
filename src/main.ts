import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import path from 'path';
import { fork } from 'child_process';

let mainWindow: BrowserWindow;
let tray: Tray;
const ICON_PATH = '/app/recursos/icono.png'
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('minimize', (event: Event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(ICON_PATH); // tu icono
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir',
      click: () => mainWindow.show()
    },
    {
      label: 'Ejecutar proceso',
      click: () => fork(path.join(__dirname, 'publicador.js'))
    },
    { label: 'Salir', click: () => app.quit() }
  ]);
  tray.setToolTip('Facebook poster TS en Docker');
  tray.setContextMenu(contextMenu);

  ipcMain.on('run-worker', () => {
    fork(path.join(__dirname, 'publicador.js'));
  });
});
