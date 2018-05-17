import React from 'react';

import {
  blinkloaderProjectId,
  blinkloaderToken,
  blinkloaderApiDomain,
  blinkloaderCdnDomain
} from './Provider';

import {
  noBlinkloaderJs,
  blinkloaderVersion,
  noBlinkloaderProjectId,
  srcPlaceholder
} from '../misc';

export default class Background extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      imgPlaceholder: null,
      disableFurtherImgRequests: false,
      imgSrc: null,
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

    this.state.initialRender = false;
    if (lazyload == true && validSdk) {
      Blinkloader.registerImage(this.renderRelevantImage, imgPlaceholder);
      return
    }

    this.renderRelevantImage();
  }

  renderRelevantImage(cb) {
    const { validSdk, imgPlaceholder } = this.state;
    const { src, progressive } = this.props;
    const { setSrcValue, setState } = this;

    const projectId = blinkloaderProjectId;
    const token = blinkloaderToken;

    let noProjectId = false;

    if (projectId === "") {
      console.error(noBlinkloaderProjectId);
      noProjectId = true;
    }

    if (!validSdk || noProjectId) {
      setSrcValue(src);
      return
    }

    const { disableFurtherImgRequests } = this.state;
    if (disableFurtherImgRequests) {
      return;
    }

    this.state.disableFurtherImgRequests = disableFurtherImgRequests || true;

    const width = Blinkloader.determineDivWidth(imgPlaceholder);
    const imagePayload = { width, src, projectId, token, pageUrl: window.location.href };

    if (blinkloaderApiDomain) {
      imagePayload.apiDomain = blinkloaderApiDomain;
    }
    if (blinkloaderCdnDomain) {
      imagePayload.cdnDomain = blinkloaderCdnDomain;
    }

    let imageSet = false;
    if (progressive) {
      Blinkloader.getSvgImage(imagePayload).then(function(url) {
        if (!imageSet) {
          setSrcValue(url);
        }
      }).catch(function(){});
    }

    let cbDone = false;
    const setImgFunc = function(url) {
      imageSet = true;
      if (!cbDone && cb) {
        cb();
      }
      setSrcValue(url);
    }

    Blinkloader.getImage(imagePayload).then(function(url) {
      setImgFunc(url);
    }).catch(function(err){
      setImgFunc(src);
    })
  }

  setSrcValue(url) {
    if (!this._isMounted) {
      return;
    }

    const {imgPlaceholder} = this.state;

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

    const {
      initialRender,
      imgSrc,
      imgPlaceholder,
      validSdk
    } = this.state

    const styles = {...style}
    if (!initialRender) {
      styles.backgroundRepeat = 'no-repeat';
      styles.backgrondPosition = 'center';
      styles.backgroundSize = 'cover';
      styles.backgroundImage = `${gradient ? gradient + ', ' : ''} url(${imgSrc || srcPlaceholder})`;
    }

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
      dataset["data-blink-background"] = true;
    }

    if (!initialRender && (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion)) {
      console.error(noBlinkloaderJs);
      return <div
        style={{...styles}}
        ref={this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      >{children}</div>;
    }
    
    if (!initialRender) {
      return <div
        style={{...styles}}
        ref={this.setImagePlaceholder}
        className={className || ''}
        {...inheritedProps}
      >{children}</div>;
    }

    return <div
      style={{...styles}}
      {...dataset}
      ref={this.setImagePlaceholder}
      className={className || ''}
      {...inheritedProps}
    >{children}</div>;
  }
};