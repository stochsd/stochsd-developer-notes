const ENTRY_POINT = 'electron.html';

/* This file is for launching StocSD in Electron or NWjs. The environment to use is auto-detected by this file */

function isRunningElectron() {
	// https://github.com/electron/electron/issues/2288
	if (typeof process !== "undefined") {
		if (typeof process.versions['electron'] !== "undefined") {
			return true;
		}
	}
	return false;
}

function isRunningNwjs() {
	// https://stackoverflow.com/questions/31968355/detect-if-web-app-is-running-in-nwjs
	try {
		return (typeof require('nw.gui') !== "undefined");
	} catch (e) {
		return false;
	}
}

if(isRunningNwjs()) {
  startInNwjs();
}

if(isRunningElectron()) {
  startInElectron();
}

function startInNwjs() {
  //  Run index.html or OpenSystemDynamics/opensystemdynamics/index.html
  nw.Window.open(ENTRY_POINT, {}, function(win) {});
}


function startInElectron() {
  // Modules to control application life and create native browser window
  const { app, BrowserWindow } = require('electron')

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      useContentSize: false,
      webPreferences: {
        nodeIntegration: true
      }
    })

    // and load the index.html of the app.
    mainWindow.loadFile(ENTRY_POINT)
    //  mainWindow.loadURL('https://gmail.com')
    mainWindow.maximize();


    // mainWindow.setSize(200, 100);
    mainWindow.setMenuBarVisibility(false)
    // Open the DevTools.
    // Can be done during runtime with ctrl+shift+I (found in the invisible menu)
    // mainWindow.webContents.openDevTools()

    const { ipcMain } = require('electron')
    ipcMain.on('destroy-message', (event, arg) => {
      mainWindow.destroy()
    })
    mainWindow.on('close', function (e) {
      // Notify render process that user tried to close the window
      mainWindow.webContents.send("try-to-close-message", 'ping')
      e.preventDefault();
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
}
