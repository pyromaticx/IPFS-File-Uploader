import React from 'react';
import ReactDOM from 'react-dom';
import LinksView from './linksview';
import SettingsView from './settingsview';
const {ipcRenderer} = electronRequire('electron');
const Datastore = require('nedb'),
  db = new Datastore({
    filename: './hashpaths.db',
    autoload: true,
  });

let links;
let nodeInfo;
if(document.getElementById('linksview')) {
  ipcRenderer.send('getLinks')
  ipcRenderer.on('sendLinks', (e,args) => {
    links = args;
    ReactDOM.render(<LinksView links={links}/>, document.getElementById('linksview'));
  })
}
if(document.getElementById('settingsview')) {
  ipcRenderer.send('getNodeInfo')
  ipcRenderer.on('sendNodeInfo', (e, args) => {
    nodeInfo = args
    ReactDOM.render(<SettingsView nodeInfo={nodeInfo} />, document.getElementById('settingsview'));
  })
}
