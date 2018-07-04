import React from "react";  

export default class BlinkloaderProvider extends React.Component {  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { prefetchList } = this.props;
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
