import React from 'react';
import PropTypes from 'prop-types';

// Important
const noBlinkloaderJs = 'Blinkloader Error! Couldn\'t optimize assets: missing "https://cdn.blinkloader.com/blinkloader-1.2.0.min.js" in page head.';
const blinkloaderVersion = '1.2.0';

const contextTypes = {
  blinkloader: PropTypes.shape({
    projectId: PropTypes.string,
    token:  PropTypes.string
  })
};

class Img extends React.Component {
  static contextTypes = contextTypes;
  constructor(props) {
    super(props);

    let validSdk = true; 
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      validSdk = false;
    }

    this.state = {
      initialRender: true,
      imgPlaceholder: null,
      width: null,
      height: null,
      disableFurtherImgRequests: false,
      imgSrc: null,
      additionalImgClasses: '',
      validSdk: validSdk
    };

    this.renderRelevantImage = this.renderRelevantImage.bind(this);
    this.setSrcValue = this.setSrcValue.bind(this);
    this.setImagePlaceholder = this.setImagePlaceholder.bind(this);
    this.setImageElement = this.setImageElement.bind(this);

    if (props.lazyload === true && validSdk) {
      Blinkloader.lazyloader.addImage();
    }
  }

  componentDidMount() {
    const { lazyload } = this.props;
    const { imgPlaceholder, validSdk } = this.state;
    if (!imgPlaceholder) {
      return;
    }
    const { height, width } = imgPlaceholder;
    this.state.initialRender = false
    this.state.height = height || width;
    this.state.width = width;

    if (lazyload == true && validSdk) {
      Blinkloader.lazyloader.loadImage();
      return
    }
    this.renderRelevantImage();
  }

  componentDidUpdate() {
  }

  renderRelevantImage() {
    const { disableFurtherImgRequests } = this.state;
    if (disableFurtherImgRequests) {
      return;
    }
    this.state.disableFurtherImgRequests = disableFurtherImgRequests || true;
    const { projectId, token } = this.context.blinkloader;
    const { setSrcValue } = this;
    const { src, testOffset } = this.props;
    const { width, height } = this.state;
    const imagePayload = { width, height, src, projectId, token, pageUrl: window.location.href };
    if (testOffset) {
      console.log("test-offset: ", testOffset);
    }
    Blinkloader.getImage(imagePayload).then(function(url){
      setSrcValue(url, 'blnk-visible');
    }).catch(function(errorMessage){
      setSrcValue(src, 'blnk-visible');
    })
  }

  setSrcValue(url, classes) {
    this.setState({
      imgSrc: url,
      additionalImgClasses: classes || '',
    });
  }

  setImagePlaceholder(el) {
    const { lazyload, testOffset } = this.props;
    const { validSdk } = this.state;
    if (lazyload === true && validSdk) {
      const y =  el && el.y || testOffset || 0;
      Blinkloader.lazyloader.registerImage(this.renderRelevantImage, y);
    }
    this.state.imgPlaceholder = el;
  }

  setImageElement(el) {
    this.imgElement = el;
  }

  render() {
    const {
      width,
      className,
      style,
      src,
      accelerate,
      asBackground,
      lazyload,
      testOffset,
      ...inheritedProps
    } = this.props;
    const {
      initialRender,
      additionalImgClasses,
      imgSrc,
      validSdk
    } = this.state
    if (!validSdk) {
      console.error(noBlinkloaderJs);
      return <img src={src} style={{width: width, ...style}} className={(className || '') + ` blnk-visible`} {...inheritedProps} />
    }
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (initialRender) {
      return <img src={imgPlaceholder} style={{width: width, ...style}} ref={this.setImagePlaceholder} className={className || ''} {...inheritedProps} />;
    }
    if (imgSrc) {
      if (accelerate === true || asBackground) {
        return <div
          style={{
            width: width,
            backgroundImage: "url(" + imgSrc + ")",
            backgroundSize: "cover",
            ...style
          }}
          ref={this.setImageElement}
          className={(className || '') + ` ${additionalImgClasses}`}
          {...inheritedProps}
        ></div>;
      }
      return <img style={{width: width, ...style}} src={imgSrc} ref={this.setImageElement} className={(className || '') + ` ${additionalImgClasses}`} {...inheritedProps} />;
    }
  }
}

export default Img;
