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
      imgHeight: null,
      calcWidth: null,
      calcDivHeight: null,
      disableFurtherImgRequests: false,
      imgSrc: null,
      svgImgSrc: null,
      svgImgSet: false,
      imgFadeoutClass: null,
      validSdk: null
    };
    this.renderRelevantImage = this.renderRelevantImage.bind(this);
    this.setSrcValue = this.setSrcValue.bind(this);
    this.setImagePlaceholder = this.setImagePlaceholder.bind(this);
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

    var w = Blinkloader.getImgWidth(imgPlaceholder);
    if (w <= 1) {
      this.state.calcWidth = Blinkloader.determineImgDivWidth(imgPlaceholder);
    } else {
      this.state.width = w;
    }

    this.state.initialRender = false;
    if (lazyload == true && validSdk) {
      Blinkloader.registerImage(this.renderRelevantImage, imgPlaceholder);
      return
    }
    this.renderRelevantImage();
  }

  renderRelevantImage(cb) {
    const { width, calcWidth, validSdk, imgPlaceholder } = this.state;
    const { src, progressive, asBackground, accelerate } = this.props;
    const { setSrcValue, setState } = this;
    if (!validSdk) {
      setSrcValue(src);
      return
    }
    const { disableFurtherImgRequests } = this.state;
    if (disableFurtherImgRequests) {
      return;
    }
    this.state.disableFurtherImgRequests = disableFurtherImgRequests || true;
    const projectId = blinkloaderProjectId;
    const token = blinkloaderToken;
    const imagePayload = { width: (width > 1 ? width : calcWidth), src, projectId, token, pageUrl: window.location.href };
    let imageSet = false;
    const that = this;
    if (progressive === true) {
      Blinkloader.getSvgImage(imagePayload).then(function(url) {
        if (!imageSet) {
          that.state.svgImgSrc = url;
          that.state.svgImgSet = true;
          setSrcValue(url);
        }
      }).catch(function(){});
    }
    let cbDone = false;
    const setImgFunc = function(url) {
      imageSet= true;
      if (!cbDone && cb) {
        cb();
      }

      setSrcValue(url);
    }
    Blinkloader.getImage(imagePayload).then(function(url) {
      if (progressive === true && !asBackground && !accelerate) {
        if (that.state.svgImgSet) {
          Blinkloader.stylePseudoEl(url, that.state.svgImgSrc, function(imgClass) {
            if (!imgClass) {
              return;
            }

            that.state.imgFadeoutClass = imgClass;
            setImgFunc(url);
          });
          return;
        }
      }

      setImgFunc(url);

      //let prevWidth = Blinkloader.getImgWidth(imgPlaceholder);
      //let curWidth = prevWidth;
      //Blinkloader.resizer.addFunc(function() {
      //  if (!Blinkloader.checkVisible(imgPlaceholder)) {
      //    return;
      //  }
      //  curWidth = Blinkloader.getImgWidth(imgPlaceholder);
      //  if (curWidth > prevWidth) {
      //    imagePayload.width = curWidth;
      //    Blinkloader.getImage(imagePayload).then(function(url) {
      //      setSrcValue(url);
      //      prevWidth = curWidth;
      //    }).catch(function() {});
      //  }
      //});
      
    }).catch(function(err){
      setImgFunc(src);
    })
  }

  setSrcValue(url) {
    if (!this._isMounted) {
      return;
    }
    const {accelerate, asBackground} = this.props;
    const {width, calcWidth, imgPlaceholder} = this.state;

    const imgDivHeight = Blinkloader.getImgDivHeight(imgPlaceholder);
    if (imgDivHeight > 1) {
      this.state.divHeight = imgDivHeight;
    }
    if (!this.state.calcDivHeight && imgDivHeight <= 1) {
      const h = Blinkloader.determineImgDivHeight(url, width > 1 ? width : calcWidth, imgPlaceholder);
      if (h > 1) {
        this.state.calcDivHeight = h;
      }
    }
    const imgHeight = Blinkloader.determineImgHeight(url, width > 1 ? width : calcWidth);
    if (imgHeight > 1) {
      this.state.imgHeight = imgHeight
    }

    this.setState({
      imgSrc: url
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

  render() {
    const {
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

    const propWidth = this.props.width;

    const {
      initialRender,
      additionalImgClasses,
      imgSrc,
      svgImgSrc,
      svgImgSet,
      width,
      calcWidth,
      height,
      calcDivHeight,
      imgStyleSet,
      imgFadeoutClass,
      imgHeight,
      originalImgSet,
      imgBackgroundSize,
      imgBackgroundPosition,
      imgPlaceholder,
      validSdk
    } = this.state

    const styles = {...style}
    if (!initialRender) {
      if (calcWidth > 1) {
        styles.width = calcWidth 
      }
      if (calcDivHeight > 1) {
        styles.height = calcDivHeight;
      }
      styles.backgroundSize = imgBackgroundSize;
      styles.backgroundPosition = imgBackgroundPosition;
      styles.backgroundRepeat = 'no-repeat';
      styles.backgroundImage = `${gradient ? gradient + ', ' : ''} url(${imgSrc || srcPlaceholder})`;
    }

    const srcPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';

    const dataset = {};
    if (initialRender) {
      dataset["data-blink-src"] = src;
      if (gradient) {
        dataset["data-blink-gradient"] = gradient;
      }
      if (lazyload) {
        dataset["data-blink-lazyload"] = true;
      }
      if (progressive) {
        dataset["data-blink-progressive"] = true;
      }
      if (asBackground || accelerate === true) {
        dataset["data-blink-accelerate"] = true;
      }
    }

    if (!initialRender && (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion)) {
      console.error(noBlinkloaderJs);
      return <img
        src={src}
        style={{
          width: propWidth || "",
          ...style
        }}
        className={(className || '')}
        {...inheritedProps}
      />
    }

    if (accelerate === true || asBackground) {
      return <div
        style={{...styles}}
        {...dataset}
        ref={this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      >{children}</div>;
    }

    if (progressive) {
      if (!initialRender) {
        if (!imgFadeoutClass) {
          return <div
            style={{...styles}}
            className={(className || '')}
            {...dataset}
            {...inheritedProps}
          ></div>
        }
        delete styles.backgroundSize;
        delete styles.backgroundPosition;
        delete styles.backgroundRepeat;
        delete styles.backgroundImage;
        return <div
          style={{
            position: 'relative',
            width: !width ? calcWidth : '',
            height: imgHeight,
            ...styles
          }}
          className={(className || '') + ` blnk-image ${imgFadeoutClass}`}
          {...inheritedProps}
        ></div>;
      }
      return <div
        {...dataset}
        style={{...styles}}
        ref={this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      ></div>;
    }

    if (!initialRender && imgSrc) {
      return <img
        src={imgSrc}
        style={{...style}}
        ref={this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      />;
    }
    return <img
      src={srcPlaceholder}
      {...dataset}
      style={{...style}}
      ref={this.setImagePlaceholder}
      className={className || ''}
      {...inheritedProps}
    />;
  }
}

export default Img;
