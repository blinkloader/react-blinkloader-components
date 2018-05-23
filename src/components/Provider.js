import React from "react";  

export let blinkloaderProjectId = '';
export let blinkloaderToken = '';

export let blinkloaderApiDomain = '';
export let blinkloaderCdnDomain = '';


export default class BlinkloaderProvider extends React.Component {  
  constructor(props) {
    super(props);
    this.setCreds = this.setCreds.bind(this);
  }

  setCreds() {
    const { projectId, token, apiDomain, cdnDomain } = this.props;
    blinkloaderProjectId = projectId;
    blinkloaderToken = token;
    blinkloaderApiDomain = apiDomain;
    blinkloaderCdnDomain = cdnDomain;
  }

  render() { 
    this.setCreds();
    return this.props.children;  
  }  
}  
