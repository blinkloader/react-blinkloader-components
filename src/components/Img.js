import React from 'react';
import PropTypes from 'prop-types';

class Img extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
      width: null,
      height: null,
      initialRender: true
    };
    this.setSrcValue = this.setSrcValue.bind(this);
    this.getInitialRatio = this.getInitialRatio.bind(this);
    this.renderRelevantImage = this.renderRelevantImage.bind(this);
  }

  getInitialRatio({ target: image }) {
    const { offsetHeight, offsetWidth } = image;
    // console.log(image.absUrl("src"))
    this.setState({initialRender: false, height: offsetHeight, width: offsetWidth });
  }

  setSrcValue(url) {
    this.setState({imgSrc: url})
  }

  renderRelevantImage() {
    const { setSrcValue } = this;
    const { src, userId } = this.props;
    const { width, height } = this.state;
    const imagePayload = { width, height, src };
    Blinkloader.getImage({src,width,height,userId}).then(function(url){
      setSrcValue(url);
    }).catch(function(errorMessage){
      // setSrcValue(src);
      // blinkloaderSendOptimizationRequest(src);
    })
  }

// select big size for unknown proportions

  // fetch cdn
  // fetch original
  // request optimization
  componentDidUpdate(prevProps, prevState) {
    const { initialRender } = this.state;
    prevState.initialRender !== initialRender && this.renderRelevantImage();
  }

  render() {
    const { width } = this.props;
    const { imgSrc, initialRender } = this.state;
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (initialRender === true) {
      return <img style={{width: width}} src={imgPlaceholder} onLoad={this.getInitialRatio} />;
    } else {
      return imgSrc && <img style={{width: width}} src={imgSrc} />;
    }
  }
}

export default Img;
