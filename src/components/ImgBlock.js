import React from 'react';

import {
  noBlinkloaderJs,
  blinkloaderVersion,
  noBlinkloaderProjectId,
  srcPlaceholder
} from '../misc';

export default class ImgBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      imgPlaceholder: null,
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
    this._isMounted = true;
    this.state.initialRender = false;

    if (this._isRendered) {
      return;
    }

    this._isMounted = true;
    const { lazyload } = this.props;
    const { imgPlaceholder, validSdk } = this.state;
    if (!imgPlaceholder) {
      return;
    }

    if (lazyload == true && validSdk) {
      Blinkloader.registerImage(this.renderRelevantImage, imgPlaceholder);
      return
    }

    this.renderRelevantImage();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {src} = nextProps;
    this.renderRelevantImage(null, src);
  }

  renderRelevantImage(cb, newsrc) {
    const { validSdk, imgPlaceholder } = this.state;
    const { progressive } = this.props;
    const { setSrcValue, setState } = this;
    let src = this.props.src;

    if (!validSdk) {
      setSrcValue(src);
      return
    }

    if (newsrc) {
      src = newsrc;
    }

    let width = Blinkloader.getDivWidth(imgPlaceholder);
    if (width <= 1) {
      width = Blinkloader.determineDivWidth(imgPlaceholder);
    }
    
    const imagePayload = { width, src, pageUrl: window.location.href };

    const that = this;

    let imageSet = false;
    if (progressive) {
      Blinkloader.getSvgImage(imagePayload, function(url) {
        if (!imageSet) {
          that.state.svgImgSrc = url;
          that.state.svgImgSet = true;
          setSrcValue(url);
        }
      }, function(){});
    }

    let cbDone = false;
    const setImgFunc = function(url) {
      imageSet= true;
      if (!cbDone && cb) {
        cb();
      }
      setSrcValue(url);
    }

    Blinkloader.getImage(imagePayload, function(url) {
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
      setImgFunc(url);
    }, function(err){
      setImgFunc(src);
    });
  }

  setSrcValue(url) {
    if (!this._isMounted) {
      return;
    }

    const {imgPlaceholder} = this.state;

    if (!this.state.initialRender && imgPlaceholder && typeof Blinkloader !== 'undefined') {
      const { src } = this.props;
      let width = Blinkloader.getDivWidth(imgPlaceholder);
      let height = Blinkloader.getDivHeight(imgPlaceholder);
      if (width <= 1 || height <= 1) {
        Blinkloader.invisibleImgWarn(src);
      }
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
      lazyload,
      progressive,
      gradient,
      children,
      ...inheritedProps
    } = this.props;

    const propWidth = this.props.width;

    const {
      initialRender,
      imgPlaceholder,
      disableFurtherImgRequests,
      imgSrc,
      svgImgSrc,
      svgImgSet,
      imgFadeoutClass,
      validSdk
    } = this.state

    const styles = {...style}
    styles.backgroundSize = 'cover';
    styles.backgroundPosition = 'center';
    styles.backgroundRepeat = 'no-repeat';
    styles.backgroundImage = `${gradient ? gradient + ', ' : ''} url(${imgSrc || srcPlaceholder})`;

    const dataset = {};
    if (initialRender) {
      dataset["data-blink-src"] = src;
      if (lazyload) {
        dataset["data-blink-lazyload"] = true;
      }
      if (gradient) {
        dataset["data-blink-gradient"] = gradient
      }
      if (progressive) {
        dataset["data-blink-progressive"] = true;
      }
      dataset["data-blink-image-block"] = true;
    }

    if (!initialRender && (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion)) {
      console.error(noBlinkloaderJs);

      return <div
        style={{...styles}}
        ref={this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      ></div>;
    }

    if (!initialRender) {
      if (!imgFadeoutClass) {
        return <div
          style={{...styles}}
          className={(className || '')}
          ref={this.setImagePlaceholder}
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
          ...styles
        }}
        ref={this.setImagePlaceholder}
        className={(className || '') + ` blnk-image ${imgFadeoutClass}`}
        {...inheritedProps}
      ></div>;
    }
    
    // initial render
    if (typeof Blinkloader !== 'undefined' && Blinkloader.version === blinkloaderVersion) {
      const imgsrc = Blinkloader.prefetchMap[src];
      if (imgsrc) {
        styles.backgroundImage = `${gradient ? gradient + ', ' : ''} url(${imgsrc})`;
        return <div
          style={{...styles}}
          className={(className || '')}
          ref={this.setImagePlaceholder}
          {...inheritedProps}
        ></div>
      }
    }
    return <div
      {...dataset}
      style={{...styles}}
      ref={this.setImagePlaceholder}
      className={className || ''}
      {...inheritedProps}
    ></div>;
  }
};
