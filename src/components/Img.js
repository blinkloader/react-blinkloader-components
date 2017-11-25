import React from 'react';
import PropTypes from 'prop-types';

const contextTypes = {
  blinkloader: PropTypes.shape({
    userId: PropTypes.string,
    token:  PropTypes.string
  })
};

class Img extends React.Component {
  static contextTypes = contextTypes;
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
    this.setState({initialRender: false, height: offsetHeight, width: offsetWidth });
  }

  setSrcValue(url) {
    this.setState({imgSrc: url})
  }

  renderRelevantImage() {
    const { setSrcValue } = this;
    const { userId, token } = this.context.blinkloader;
    const { src } = this.props;
    const { width, height } = this.state;
    const imagePayload = { width, height, src, userId, token };
    Blinkloader.getImage(imagePayload).then(function(url){
      setSrcValue(url);
    }).catch(function(errorMessage){
      setSrcValue(src);
    })
  }

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
