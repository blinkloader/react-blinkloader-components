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

export default class Img extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      imgPlaceholder: null,
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
    if (lazyload && validSdk) {
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

    let width = Blinkloader.getDivWidth(imgPlaceholder);
    if (width <= 1) {
      width = Blinkloader.determineDivWidth(imgPlaceholder);
    }
    const imagePayload = { width, src, projectId, token, pageUrl: window.location.href };
    const that = this;

    if (blinkloaderApiDomain) {
      imagePayload.apiDomain = blinkloaderApiDomain;
    }
    if (blinkloaderCdnDomain) {
      imagePayload.cdnDomain = blinkloaderCdnDomain;
    }

    let imageSet = false;
    if (progressive) {
      Blinkloader.getSvgImage(imagePayload, function(url) {
        if (!imageSet) {
          setSrcValue(url);
        }
      }, function(){});
    }

    let cbDone = false;
    const setImgFunc = function(url) {
      imageSet = true;
      if (cb && !cbDone) {
        cb();
      }
      setSrcValue(url);
    }
    Blinkloader.getImage(imagePayload, function(url) {
      setImgFunc(url);
    }, function(err){
      setImgFunc(src);
    })
  }

  setSrcValue(url) {
    if (!this._isMounted) {
      return;
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
    if (el && el.dataset && !el.dataset.blinkSrc && !el.dataset.blinkDefer) {
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
      defer,
      ...inheritedProps
    } = this.props;

    const {
      initialRender,
      imgSrc,
      imgPlaceholder,
    } = this.state

    const srcPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';

    const dataset = {};
    if (initialRender) {
      dataset["data-blink-src"] = src;
      if (lazyload) {
        dataset["data-blink-lazyload"] = true;
      }
      if (progressive) {
        dataset["data-blink-progressive"] = true;
      }
      if (defer) {
        dataset["data-blink-defer"] = true;
      }
    }

    if (!initialRender && (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion)) {
      console.error(noBlinkloaderJs);
      return <img
        src={src}
        style={{...style}}
        className={(className || '')}
        {...inheritedProps}
      />
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
};
