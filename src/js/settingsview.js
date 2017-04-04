import React, {Component} from 'react';

export default class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeInfo: props.nodeInfo
    }
  }
  listItems (items) {
    return items.map((item) => {
      return (
        <div key={Math.random()}>
          <h5><i>{item}</i></h5>
        </div>
      )
    })
  }
  render() {
    console.log(this.state.nodeInfo)
    return (
      <div className='settingsWrapper selectable'>
        <h5>Node Id:</h5>
        <h6><i>{this.state.nodeInfo.node.id}</i></h6>
        <h5>Public Key:</h5>
        <h6><i>{this.state.nodeInfo.node.publicKey}</i></h6>
        <h5>Agent Version:</h5>
        <h6><i>{this.state.nodeInfo.node.agentVersion}</i></h6>
        <h5>Protocol Version:</h5>
        <h6><i>{this.state.nodeInfo.node.protocolVersion}</i></h6>
        <h5>Local Addresses:</h5>
        <h6><i>{this.listItems(this.state.nodeInfo.node.addresses)}</i></h6>
      </div>
    );
  }
}
