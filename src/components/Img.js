import React from 'react';
import PropTypes from 'prop-types';

class Img extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null
    };
    this.setSrcValue = this.setSrcValue.bind(this);
  }

  setSrcValue(url) {
    this.setState({imgSrc: url})
  }

  // fetch cdn
  // fetch original
  // request optimization
  componentDidMount() {
    const { setSrcValue } = this;
    const { src } = this.props;
    blinkloaderGetImage('https://httpstat.us/303').then(function(url){
      setSrcValue(url);
    }).catch(function(errorMessage){
      setSrcValue(src);
      blinkloaderSendOptimizationRequest(src);
    })
  }

  render() {
    const { imgSrc } = this.state;
    return imgSrc && <img src={imgSrc} />;
  }
}

export default Img;
