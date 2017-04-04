import React, {Component} from 'react';
import IpfsLink from './ipfslink';

export default class LinkView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileObjs: props.links
    }
  }
  componentDidMount() {

  }
  fmtHashLinks() {
    let links = this.state.fileObjs.map((ipfsFile) => {
      return (
        <IpfsLink linkData={ipfsFile} />
      );
    })
    return links;
  }
  render() {
    return (
      <div className='linksWrapper'>
        {this.fmtHashLinks()}
      </div>
    );
  }
}
