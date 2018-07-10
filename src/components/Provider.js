import React from "react";  

export default class BlinkloaderProvider extends React.Component {  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      prefetchList,
      apiDomain,
      cdnDomain,
      projectId,
      token
    } = this.props;
    try {
      Blinkloader.config({
        apiDomain: apiDomain,
        cdnDomain: cdnDomain,
        projectId: projectId,
        token: token
      });
    } catch (e) {}
    try {
      Blinkloader.prefetch(prefetchList);
    } catch (e) {
      console.warn("Blinkloader: couldn't prefetch images: " + prefetchList + ", probably because there is an error loading Blinkloader SDK")
    }
  }

  render() { 
    return this.props.children;  
  }  
}  
