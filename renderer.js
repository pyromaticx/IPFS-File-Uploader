// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')
const $ = require('./public/js/jquery-3.2.1.min.js')
//send message to ipcMain channel1


document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files);
  let files = [].slice.call(ev.dataTransfer.files);
  let paths = files.map((file) => {
    return file.path
  })
  ipcRenderer.send('fileChange', paths)
  ev.preventDefault()
}
document.getElementById('manualLocBtn').addEventListener('click', (e) => {
  ipcRenderer.send('openFilePicker', 'open')
})
document.getElementById('linksbtn').addEventListener('click', (e) => {
  ipcRenderer.send('openLinksWindow', 'open')
})
document.getElementById('settingsbtn').addEventListener('click', (e) => {
  ipcRenderer.send('settingsMenu', 'open')
})
