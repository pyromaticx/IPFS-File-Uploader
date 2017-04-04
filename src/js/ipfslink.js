import React, {Component} from 'react'
let {clipboard} = electronRequire('electron');
export default class IpfsFile extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      link: props.linkData,
      hashHover: false,
      copyHashText: 'Copy hash',
      linkHover: false,
      copyLinkText: 'Copy link'
    }
  }
  getFileExt() {
    var name = this.state.link.file.name
    var ext = name.substr(name.lastIndexOf('.') + 1, name.length);
    console.log(ext);
    return ext;
  }
  toggleHashHover() {
    this.setState({
      hashHover: !this.state.hashHover,
      copyHashText: 'Copy hash'
    })
  }
  toggleLinkHover() {
    this.setState({
      linkHover: !this.state.linkHover,
      copyLinkText: 'Copy link'
    })
  }
  copyHashOnly() {
    clipboard.writeText(this.state.link.file.hash)
    this.setState({
      copyHashText: 'Copied!'
    })
  }
  copyLink() {
    clipboard.writeText(this.state.link.file.link)
    this.setState({
      copyLinkText: 'Copied!'
    })
  }
  openFile() {
    var a = document.createElement('a');
    a.href = this.state.link.file.link;
    a.setAttribute('target', '_blank');
    a.click();
  }
  render() {
    return (
      <div className='ipfsLinkWrapper'>
        <div className='iconWrapper'>
          <span className='file-icon file-icon-lg' data-type={this.getFileExt()}></span>
        </div>
        <div style={{width: '80%'}}>
          <h3 style={{cursor: 'pointer'}} onClick={() => {this.openFile()}}>{this.state.link.file.name}</h3>
          <h6 style={{cursor: 'pointer'}} onClick={(e) => {this.copyHashOnly()}} onMouseEnter={(e) => {this.toggleHashHover()}} onMouseLeave={(e) => {this.toggleHashHover()}}><i>{this.state.link.file.hash}</i><span style={{display: this.state.hashHover ? 'inline' : 'none', marginLeft: '15px', color: 'green'}}>{this.state.copyHashText}</span></h6>
          <h6 style={{cursor: 'pointer'}} onClick={(e) => {this.copyLink()}} onMouseEnter={(e) => {this.toggleLinkHover()}} onMouseLeave={(e) => {this.toggleLinkHover()}}>{this.state.link.file.link}<span style={{display: this.state.linkHover ? 'inline' : 'none', marginLeft: '15px', color: 'green'}}>{this.state.copyLinkText}</span></h6>
        </div>
      </div>
    );
  }
}
