import React from "react";  

import { blinkloaderVersion, setBlinkloaderCreds } from './Img'; 

class BlinkloaderProvider extends React.Component {  
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

export default BlinkloaderProvider;
