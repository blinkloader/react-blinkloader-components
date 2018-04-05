import React from 'react';
import PropTypes from 'prop-types';

// Important
const noBlinkloaderJs = 'Blinkloader Error! Couldn\'t optimize assets: missing "https://cdn.blinkloader.com/blinkloader-1.0.4.min.js" in page head.';
const blinkloaderVersion = '1.0.4';

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
    this.state = {
      imgSrc: null,
      width: null,
      height: null,
      additionalImgClasses: '',
      initialRender: true,
      placeholderTriggered: false,
      imgPlaceholder: null,
      imgElement: null
    };
    this.setSrcValue = this.setSrcValue.bind(this);
    this.renderRelevantSvgImage = this.renderRelevantSvgImage.bind(this);
    this.renderRelevantImage = this.renderRelevantImage.bind(this);
    this.triggeredEmptyPlaceholder = this.triggeredEmptyPlaceholder.bind(this);
    this.setImagePlaceholder = this.setImagePlaceholder.bind(this);
    this.setImageElement = this.setImageElement.bind(this);
    if (props.lazyload) {
      Blinkloader.lazyloader.addImage();
    }
  }

  setSrcValue(url, classes, config) {
    this.setState({
      imgSrc: url,
      additionalImgClasses: classes || '',
      placeholderTriggered: this.state.placeholderTriggered || (config||{}).isPlaceholder
    })
  }

  triggeredEmptyPlaceholder() {
    this.setState({ placeholderTriggered: true });
  }

  renderRelevantImage() {
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      console.error(noBlinkloaderJs);
      setSrcValue(src, 'blnk-visible');
      return
    }
    if (this.disableFurtherImgRequests) {
      return
    }
    this.disableFurtherImgRequests = this.disableFurtherImgRequests || true;
    const { setSrcValue } = this;
    const { projectId, token } = this.context.blinkloader;
    const { src } = this.props;
    const { width, height, placeholderTriggered } = this.state;
    const imagePayload = { width, height, src, projectId, token, pageUrl: window.location.href };
    const replaceSvgWithImage = (lnk) => {
      setTimeout(function () {
        setSrcValue(lnk, 'blnk-unblur', {isTarget: true});
        setTimeout(function () {
          setSrcValue(lnk, 'blnk-visible',  {isTarget: true});
        }, 1000);
      }, 800);
    }
    Blinkloader.getImage(imagePayload).then(function(url){
      if (placeholderTriggered) {
        replaceSvgWithImage(url);
      } else {
        setSrcValue(url, 'blnk-visible');
      }
    }).catch(function(errorMessage){
      setSrcValue(src, 'blnk-visible');
    })
  }

  renderRelevantSvgImage() {
    if (typeof Blinkloader === 'undefined' || Blinkloader.version !== blinkloaderVersion) {
      console.error(noBlinkloaderJs);
      setSrcValue(src, 'blnk-visible');
    }
    if (this.disableFurtherSvgImgRequests) {
      return
    }
    this.disableFurtherSvgImgRequests = this.disableFurtherSvgImgRequests || true;
    const { setSrcValue, triggeredEmptyPlaceholder } = this;
    const { projectId, token } = this.context.blinkloader;
    const { src } = this.props;
    const { width, height } = this.state;
    const imagePayload = { width, height, src, projectId, token, pageUrl: window.location.href };
    Blinkloader.getSvgImage(imagePayload).then(function(svgUrl){
      setSrcValue(svgUrl, 'blnk-fadein', {isPlaceholder: true});
    }).catch(function (svgErr) {
      setSrcValue(src, 'blnk-visible');
    });
  }

  componentDidMount() {
    const { progressive, lazyload } = this.props;
    const { imgPlaceholder } = this;
    if (!imgPlaceholder) {
      return
    }
    const { width } = imgPlaceholder;
    this.setState({initialRender: false, width, height: width });
    if (progressive === true) {
      return
    }
    if (lazyload === true) {
      Blinkloader.lazyloader.loadImage();
      return
    }
    this.renderRelevantImage();
  }

  componentDidUpdate(prevProps, prevState) {
    const { initialRender, placeholderTriggered } = this.state;
    const { imgElement, imgPlaceholder, setSrcValue } = this;
    const { progressive, lazyload } = this.props;
    if (progressive === false) {
      return
    }
    if (placeholderTriggered === true && prevState.placeholderTriggered === false) {
      if (lazyload === true) {
        Blinkloader.lazyloader.loadImage();
        return
      }
      this.renderRelevantImage();
    }
    if (prevState.initialRender === initialRender) {
      return
    }
    if (lazyload === true) {
      Blinkloader.lazyloader.loadImage({svg: true});
      return
    }
    this.renderRelevantSvgImage();
  }

  setImagePlaceholder(el) {
    if (this.props.lazyload === true && el) {
      let offset = el.y
      if (offset < 0) {
        offset = -offset
      }
      Blinkloader.lazyloader.registerImage(this.renderRelevantImage, this.renderRelevantSvgImage, offset)
    }
    this.imgPlaceholder = el;
  }

  setImageElement(el) {
    this.imgElement = el;
  }

  render() {
    const { width, src, className, progressive, lazyload, ...inheritedProps } = this.props;
    const { imgSrc, initialRender, additionalImgClasses } = this.state;
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (initialRender === true || !imgSrc) {
      return <img
        style={{width: width, height: width}}
        src={imgPlaceholder}
        ref={this.setImagePlaceholder}
        className={className}
        {...inheritedProps}
      />;
    }
    return imgSrc && <img
      style={{width: width}}
      src={imgSrc}
      ref={this.setImageElement}
      className={className + ` ${additionalImgClasses}`}
      {...inheritedProps}
    />;
  }
}

export default Img;
