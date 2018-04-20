import React from 'react';
import PropTypes from 'prop-types';

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
      imgPlaceholder: null,
      width: null,
      height: null,
      disableFurtherImgRequests: false,
      imgSrc: null,
      additionalImgClasses: '',
      validSdk: null
    };
    this.renderRelevantImage = this.renderRelevantImage.bind(this);
    this.setSrcValue = this.setSrcValue.bind(this);
    this.setImagePlaceholder = this.setImagePlaceholder.bind(this);
    this.setImageElement = this.setImageElement.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { lazyload } = this.props;
    const { imgPlaceholder, validSdk } = this.state;
    if (!imgPlaceholder) {
      return;
    }
    const { height, width } = imgPlaceholder;
    this.state.height = height || width;
    this.state.width = width;
    if (lazyload == true && validSdk) {
      Blinkloader.registerImage(this.renderRelevantImage, imgPlaceholder);
      return
    }
    this.renderRelevantImage();
  }

  componentDidUpdate() {
  }

  renderRelevantImage(cb) {
    const { width, height, validSdk } = this.state;
    const { src, progressive } = this.props;
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
    let cbDone = false;
    const setImgFunc = function(url) {
      const blnkClass = svgSet ? 'blnk-unblur' : 'blnk-visible';
      imageSet= true;
      if (!cbDone && cb) {
        cb();
      }
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
    let validSdk = true; 
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      validSdk = false;
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
      gradient,
      lazyload,
      progressive,
      testOffset,
      children,
      ...inheritedProps
    } = this.props;
    const {
      additionalImgClasses,
      imgSrc,
      validSdk
    } = this.state
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      console.error(noBlinkloaderJs);
      return <img
        src={src}
        style={{width: width || style && style.width, ...style}}
        className={(className || '') + ` blnk-visible`}
        {...inheritedProps}
      />
    }
    if (accelerate === true || asBackground) {
      return <div
        style={{
          width: width || style && style.width,
          backgroundImage: `${gradient ? gradient + ', ' : ''} url(${imgSrc || imgPlaceholder})`,
          backgroundSize: style.backgroundSize ? style.backgroundSize : "cover",
          ...style
        }}
        ref={imgSrc ? this.setImageElement : this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      >{children}</div>;
    }
    if (imgSrc) {
      return <img
        style={{width: width || style && style.width, ...style}}
        src={imgSrc}
        ref={this.setImageElement}
        className={(className || '') + ` ${additionalImgClasses}`}
        {...inheritedProps}
      />;
    }
    return <img
      src={imgPlaceholder}
      style={{width: width || style && style.width, ...style}}
      ref={this.setImagePlaceholder}
      className={className || ''}
      {...inheritedProps}
    />;
  }
}

export default Img;
