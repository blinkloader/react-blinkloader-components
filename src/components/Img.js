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
      initialRender: true,
      imgPlaceholder: null,
      imgBackgroundSize: null,
      imgBackgroundPosition: null,
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
    if (this._isRendered) {
      return;
    }

    this._isMounted = true;
    const { lazyload } = this.props;
    const { imgPlaceholder, validSdk } = this.state;
    if (!imgPlaceholder) {
      return;
    }

    this.state.imgBackgroundSize = Blinkloader.determineBgSize(imgPlaceholder);
    this.state.imgBackgroundPosition = Blinkloader.determineBgPosition(imgPlaceholder);
    this.state.width = Blinkloader.determineImgWidth(imgPlaceholder);

    this.state.initialRender = false;
    if (lazyload == true && validSdk) {
      Blinkloader.registerImage(this.renderRelevantImage, imgPlaceholder);
      return
    }
    this.renderRelevantImage();
  }

  componentDidUpdate() {
  }

  renderRelevantImage(cb) {
    const { width, validSdk } = this.state;
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
    const imagePayload = { width, src, projectId, token, pageUrl: window.location.href };
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
    if (!this._isMounted) {
      return;
    }
    const {accelerate, asBackground} = this.props;
    const {width, imgPlaceholder} = this.state;
    if ((accelerate === true || asBackground) && !this.state.height) {
      this.state.height = Blinkloader.determineImgHeight(url, width, imgPlaceholder);
    }
    this.setState({
      imgSrc: url,
      additionalImgClasses: classes || ''
    });
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
    if (el && el.dataset && !el.dataset.blinkSrc) {
      this._isRendered = true;
    }
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
      initialRender,
      additionalImgClasses,
      imgSrc,
      imgBackgroundSize,
      imgBackgroundPosition,
      validSdk
    } = this.state
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (!initialRender && (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion)) {
      console.error(noBlinkloaderJs);
      return <img
        src={src}
        style={{
          width: width || "",
          ...style
        }}
        className={(className || '') + ` blnk-visible`}
        {...inheritedProps}
      />
    }
    const dataset = {};
    if (initialRender) {
      dataset["data-blink-src"] = src;
    }
    if (gradient) {
      dataset["data-blink-gradient"] = gradient;
    }
    if (lazyload) {
      dataset["data-blink-lazyload"] = true;
    }
    if (progressive) {
      dataset["data-blink-progressive"] = true;
    }
    if (accelerate === true || asBackground) {
      const {width, height} = this.state;
      return <div
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: !initialRender && imgBackgroundSize,
          backgroundPosition: !initialRender && imgBackgroundPosition,
          backgroundImage: `${gradient ? gradient + ', ' : ''} url(${imgSrc || imgPlaceholder})`,
          width: !initialRender && width || "",
          height: !initialRender && height || "",
          ...style
        }}
        {...dataset}
        ref={imgSrc ? this.setImageElement : this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      >{children}</div>;
    }
    if (imgSrc) {
      return <img
        style={{width: width}}
        src={imgSrc}
        ref={this.setImageElement}
        className={(className || '') + ` ${additionalImgClasses}`}
        {...inheritedProps}
      />;
    }
    return <img
      src={imgPlaceholder}
      {...dataset}
      style={{...style}}
      ref={this.setImagePlaceholder}
      className={className || ''}
      {...inheritedProps}
    />;
  }
}

export default Img;
