import React from 'react'; import PropTypes from 'prop-types';

// Important
const noBlinkloaderJs = 'Blinkloader Error! Couldn\'t optimize assets: missing "https://cdn.blinkloader.com/blinkloader-1.2.0.min.js" in page head.';
export const blinkloaderVersion = '1.2.0';

let blinkloaderProjectId = '';
let blinkloaderToken = '';

export const setBlinkloaderCreds = (pId, t) => {
  blinkloaderProjectId = pId;
  blinkloaderToken = t;
}

class Img extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      imgPlaceholder: null,
      width: null,
      height: null,
      disableFurtherImgRequests: false,
      imgSrc: null,
      additionalImgClasses: '',
      validSdk: null,
      offsetY: null
    };
    this.renderRelevantImage = this.renderRelevantImage.bind(this);
    this.setSrcValue = this.setSrcValue.bind(this);
    this.setImagePlaceholder = this.setImagePlaceholder.bind(this);
    this.setImageElement = this.setImageElement.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { lazyload } = this.props;
    const { imgPlaceholder, validSdk, offsetY } = this.state;
    if (!imgPlaceholder) {
      return;
    }
    const { height, width } = imgPlaceholder;
    this.state.initialRender = false
    this.state.height = height || width;
    this.state.width = width;
    if (lazyload == true && validSdk) {
      Blinkloader.loadImageWithOffset(this.renderRelevantImage, offsetY);
      return
    }
    this.renderRelevantImage();
  }

  componentDidUpdate() {
  }

  renderRelevantImage() {
    const { width, height, validSdk } = this.state;
    const { src, testOffset, progressive } = this.props;
    const { setSrcValue } = this;
    if (!validSdk) {
      setSrcValue(src, 'blnk-visible');
      return
    }
    const { disableFurtherImgRequests } = this.state;
    if (disableFurtherImgRequests) {
      return;
    }
    this.state.disableFurtherImgRequests = disableFurtherImgRequests || true;
    const projectId = blinkloaderProjectId;
    const token = blinkloaderToken;
    const imagePayload = { width, height, src, projectId, token, pageUrl: window.location.href };
    if (testOffset) {
      console.log("test-offset: ", testOffset);
    }
    let imageSet = false;
    let svgSet = false;
    if (progressive === true) {
      Blinkloader.getSvgImage(imagePayload).then(function(url) {
        if (!imageSet) {
          svgSet = true;
          setSrcValue(url, 'blnk-fadein');
        }
      }).catch(function(){})
    }
    const setImgFunc = function(url) {
      const blnkClass = svgSet ? 'blnk-unblur' : 'blnk-visible';
      imageSet= true;
      setSrcValue(url, blnkClass);
    }
    Blinkloader.getImage(imagePayload).then(function(url) {
      setImgFunc(url);
    }).catch(function(error){
      setImgFunc(src);
    })
  }

  setSrcValue(url, classes) {
    if (this._isMounted) {
      this.setState({
        imgSrc: url,
        additionalImgClasses: classes || ''
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setImagePlaceholder(el) {
    const { testOffset, lazyload } = this.props;
    let validSdk = true; 
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      validSdk = false;
    }
    if (lazyload === true && validSdk) {
      const y = el && el.getBoundingClientRect().y || testOffset || 0;
      this.state.offsetY = y;
    }
    this.state.validSdk = validSdk;
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
      progressive,
      testOffset,
      ...inheritedProps
    } = this.props;
    const {
      initialRender,
      additionalImgClasses,
      imgSrc,
      validSdk
    } = this.state
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (initialRender) {
      return <img src={imgPlaceholder} style={{width: width || style && style.width, ...style}} ref={this.setImagePlaceholder} className={className || ''} {...inheritedProps} />;
    }
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      console.error(noBlinkloaderJs);
      return <img src={src} style={{width: width || style && style.width, ...style}} className={(className || '') + ` blnk-visible`} {...inheritedProps} />
    }
    if (imgSrc) {
      if (accelerate === true || asBackground) {
        return <div
        style={{
          width: width || style && style.width,
            backgroundImage: "url(" + imgSrc + ")",
            backgroundSize: "cover",
            ...style
        }}
        ref={this.setImageElement}
        className={(className || '') + ` ${additionalImgClasses}`}
        {...inheritedProps}
          ></div>;
      }
      return <img style={{width: width || style && style.width, ...style}} src={imgSrc} ref={this.setImageElement} className={(className || '') + ` ${additionalImgClasses}`} {...inheritedProps} />;
    }
  }
}

export default Img;
