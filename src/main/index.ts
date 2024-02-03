import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const fs = require('fs');
const path = require('path');

//app.disableHardwareAcceleration();
const notesDir = path.join(app.getPath('home'), '.memento', 'notes');
const canvasesDir = path.join(app.getPath('home'), '.memento', 'canvases');

// Ensure the notes directory exists
if (!fs.existsSync(notesDir)) {
  console.log("creating notes directory at " + notesDir)
  fs.mkdirSync(notesDir, { recursive: true });
} else {
  console.log("notes directory already exists at " + notesDir)
}

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

  ipcMain.on('list-docs', async (event) => {
    console.log("listing existing notes")

    // Ensure the directory exists
    if (!fs.existsSync(notesDir)) {
        fs.mkdirSync(notesDir, { recursive: true });
    }
    if (!fs.existsSync(canvasesDir)) {
        fs.mkdirSync(canvasesDir, { recursive: true });
    }

    // Function to read files from a directory
    const readDir = (dir) => new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error(`Failed to read directory: ${dir}`, err);
                reject(err);
            } else {
                resolve(files);
            }
        });
    });

    try {
      // Read both directories
      const notesFiles = await readDir(notesDir);
      const canvasesFiles = await readDir(canvasesDir);

      // Combine and send the results
      event.reply('list-docs-response', { notes: notesFiles, canvases: canvasesFiles });
    } catch (err) {
      event.reply('list-docs-response', { notes: [], canvases: [] });
    }
  });

  ipcMain.handle('read-note', async (event, note) => {
    console.log("reading note")
    console.log(note)
    const notesDir = path.join(app.getPath('home'), '.memento', 'notes', note);
  
    try {
      const noteContent = await fs.promises.readFile(notesDir, 'utf-8');
      console.log('Note file content:', noteContent);
      return noteContent;
    } catch (error) {
      console.error('Error reading note file:', error);
      throw error;
    }
  });


  ipcMain.handle('save-note', async (event, filename, content) => {
    console.log("Saving note", filename);
    const filePath = path.join(notesDir, filename);

    try {
      await fs.promises.writeFile(filePath, content, 'utf-8');
      console.log('Note saved successfully:', filePath);
      return { success: true, message: "Note saved successfully" };
    } catch (error) {
      console.error('Error saving note:', error);
      return { success: false, message: "Error saving note", error: error.message };
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
