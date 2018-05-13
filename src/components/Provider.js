import React from "react";  

export let blinkloaderProjectId = '';
export let blinkloaderToken = '';

export const setBlinkloaderCreds = (pId, t) => {
  blinkloaderProjectId = pId;
  blinkloaderToken = t;
}

export default class BlinkloaderProvider extends React.Component {  
  constructor(props) {
    super(props);
    this.setCreds = this.setCreds.bind(this);
  }

  setCreds() {
    const { projectId, token } = this.props;
    setBlinkloaderCreds(projectId, token);
  }

  render() { 
    this.setCreds();
    return this.props.children;  
  }  
}  
