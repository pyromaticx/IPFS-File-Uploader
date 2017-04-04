const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const {BrowserWindow, dialog, ipcMain, webContents} = electron
const ipfsAPI = require('ipfs-api')
const fs = require('fs')
const path = require('path')
const url = require('url')
const spawn = require('child_process').spawn
const Datastore = require('nedb'),
  db = new Datastore({filename: './hashpaths.db', autoload: true})
//spawn('ipfs', ['daemon']);

let ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let linksWindow
let settingsWindow

//event handlers for renderer message events
ipcMain.on('fileChange', (e, paths) => {
  handleFile(paths);
})
ipcMain.on('openFilePicker', (e, args) => {
  showDialog();
})
ipcMain.on('openLinksWindow', (e, args) => {
  openLinksWindow();
})
ipcMain.on('settingsMenu', (e, args) => {
  openSettingsWindow();
})
ipcMain.on('getLinks', (e, args) => {
  db.find({}, (e, data) => {
    if(data) {
      linksWindow.webContents.send('sendLinks', data)
    }
  })
})
ipcMain.on('getNodeInfo', (e, args) => {
  let id;
  let version;

  ipfs.id((e, data) => {
    id = data;
    ipfs.version((e, data) => {
      version = data;
      settingsWindow.send('sendNodeInfo', {
        node: id,
        version: version
      })
    });
  });
})
function showDialog() {
  dialog.showOpenDialog(mainWindow, {
    buttonLabel: 'Select',
    properties: ['openFile', 'multiSelections', 'createDirectory']
  },
  (paths) => {
    handleFile(paths);
  })
}
const handleFile = (paths) => {
  // if no paths, return (close window, cancel)
  if (!paths) {
    return;
  }
  // store an array of formatted results of ipfs.file.add
  let hashes = [];
    paths.forEach((path) => {
      //create a stream for each path
      let fileStr = fs.createReadStream(path)
      let fileObj = [{
        path: path,
        content: fileStr
      }]
      // current IPFS-API add() does not seem to accept an options obj as the doc states.
      ipfs.files.add(fileObj, function (err, files) {
        if(err) {
          console.log(err);
        }
        if(files) {
          hashes.push({
            file: {
              name: files[0].path.substr(files[0].path.lastIndexOf('/') + 1, files[0].path.length),
              hash: files[0].hash,
              size: files[0].size,
              link: 'https://gateway.ipfs.io/ipfs/' + files[0].hash
            },
            parent: {
              name: files[1].path,
              hash: files[1].hash
            }
          })
        }
        if(hashes.length === paths.length) {
          addToFileLib(hashes)
        }
      })
    })
}
const addToFileLib = (hashes) => {
    hashes.forEach((hashObj) => {
      db.insert(hashObj, function(err, newDoc) {
        console.log(newDoc)
      })
    })
}

function openLinksWindow () {
  if(!linksWindow) {
      linksWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        show: false,
        frame: true
      })

      linksWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'links.html'),
        protocol: 'file:',
        slashes: true
      }))
    //linksWindow.webContents.openDevTools()
      linksWindow.once('ready-to-show', (e)=> {
        linksWindow.show();
      })
      // Emitted when the window is closed.
      linksWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        linksWindow = null
      })
  } else {
    linksWindow.focus()
  }
}
function openSettingsWindow() {
  if(!settingsWindow) {
    settingsWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minHeight: 600,
      minWidth: 800,
      show: false,
      frame: true
    })
    settingsWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'settings.html'),
      protocol: 'file:',
      slashes: true
    }))
    settingsWindow.webContents.openDevTools()
    settingsWindow.once('ready-to-show', (e)=> {
      settingsWindow.show();
    })
    // Emitted when the window is closed.
    settingsWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      linksWindow = null
    })
  } else {
    settingsWindow.focus()
  }
}
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
     width: 400,
     height: 376,
     show: false,
     center: true,
     frame: false,
     transparent: true,
     minWidth: 400,
     minHeight: 376,
     maxWidth: 400,
     maxHeight: 376
   })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  //Open window when ready
  mainWindow.once('ready-to-show', (e)=> {
    mainWindow.show();
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
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
