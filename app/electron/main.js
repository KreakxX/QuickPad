import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ipcMain } from 'electron';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/Logo.png'),
    title: "",
    frame: false,
    titleBarOverlay: {
      color: "#09090b",   // Hintergrund
      symbolColor: "#52525b" // Buttons
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),

      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webviewTag: true,
      partition: 'persist:main'
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadURL("http://localhost:3000")

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on("window-minimize", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
})

ipcMain.on("window-close", () => {
  if (mainWindow) {
    mainWindow.close();
  }
})

ipcMain.on("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
})

app.commandLine.appendSwitch("disable-features", "SitePerProcess,VizDisplayCompositor");
app.commandLine.appendSwitch("disable-site-isolation-trials");

app.commandLine.appendSwitch("renderer-process-limit", "4");
app.commandLine.appendSwitch("max_active_webgl_contexts", "8");

app.commandLine.appendSwitch("enable-features", "VaapiVideoDecoder,VaapiIgnoreDriverChecks");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-oop-rasterization");
app.commandLine.appendSwitch("disable-software-rasterizer");

app.commandLine.appendSwitch("enable-zero-copy");
app.commandLine.appendSwitch("disable-gpu-driver-bug-workarounds");

app.commandLine.appendSwitch("max_old_space_size", "4096");
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=4096");

app.commandLine.appendSwitch("enable-quic");
app.commandLine.appendSwitch("enable-tcp-fast-open");
app.commandLine.appendSwitch("aggressive-cache-discard");

app.commandLine.appendSwitch("disable-features", "SitePerProcess,VizDisplayCompositor,TranslateUI,AutofillServerCommunication");
app.commandLine.appendSwitch("disable-component-extensions-with-background-pages");
app.commandLine.appendSwitch("disable-default-apps");
app.commandLine.appendSwitch("disable-extensions");

app.commandLine.appendSwitch("disable-background-media-suspend");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
