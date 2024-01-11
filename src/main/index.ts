import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const fs = require('fs');
const path = require('path');

//app.disableHardwareAcceleration();

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('list-notes', (event) => {
    console.log("listing existing notes")
    const notesDir = path.join(app.getPath('home'), '.memento');

    // Ensure the directory exists
    if (!fs.existsSync(notesDir)) {
        fs.mkdirSync(notesDir, { recursive: true });
    }

    // Read the directory for note files
    fs.readdir(notesDir, (err, files) => {
        if (err) {
            console.error('Failed to read directory:', err);
            event.reply('list-notes-response', []);
        } else {
            console.log('Found files:', files);
            // Filter or process the files array as needed
            event.reply('list-notes-response', files);
        }
    });
  });

  ipcMain.handle('read-note', async (event, note) => {
    console.log("reading note")
    console.log(note)
    const notesDir = path.join(app.getPath('home'), '.memento', note);
  
    try {
      const noteContent = await fs.promises.readFile(notesDir, 'utf-8');
      console.log('Note file content:', noteContent);
      return noteContent;
    } catch (error) {
      console.error('Error reading note file:', error);
      throw error;
    }
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "*" // TODO: what a pain...
         // "default-src '*' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' localhost:5173; connect-src 'self'; font-src https://unpkg.com/@tldraw/;"
        ]
      }
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
