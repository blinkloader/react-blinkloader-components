import React from "react";  

export let blinkloaderProjectId = '';
export let blinkloaderToken = '';

export let blinkloaderApiDomain = '';
export let blinkloaderCdnDomain = '';


export const setBlinkloaderCreds = (pId, t, apiE, cdnE) => {
  blinkloaderProjectId = pId;
  blinkloaderToken = t;
  blinkloaderApiDomain = apiE;
  blinkloaderCdnDomain = cdnE;
}

export default class BlinkloaderProvider extends React.Component {  
  constructor(props) {
    super(props);
    this.setCreds = this.setCreds.bind(this);
  }

  setCreds() {
    const { projectId, token, apiDomain, cdnDomain } = this.props;
    setBlinkloaderConfigs(projectId, token, apiDomain, cdnDomain);
  }

  render() { 
    this.setCreds();
    return this.props.children;  
  }  
}  
