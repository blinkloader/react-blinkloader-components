import React from 'react';
import PropTypes from 'prop-types';

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
    const { src } = this.props;
    if (typeof Blinkloader !== 'undefined' && Blinkloader.version === '1.0.4') {
      if (!this.disableFurtherImgRequests) {
        this.disableFurtherImgRequests = this.disableFurtherImgRequests || true;
        const { setSrcValue } = this;
        const { projectId, token } = this.context.blinkloader;
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
    } else {
      console.error('Blinkloader Error! Couldn\'t optimize assets: missing "https://cdn.blinkloader.com/blinkloader-1.0.4.min.js" in page head.')
      this.setSrcValue(src, 'blnk-visible');
    }
  }

  renderRelevantSvgImage() {
    const { src } = this.props;
    if (typeof Blinkloader !== 'undefined' && Blinkloader.version === '1.0.4') {
      if (!this.disableFurtherSvgImgRequests) {
        this.disableFurtherSvgImgRequests = this.disableFurtherSvgImgRequests || true;
        const { setSrcValue, triggeredEmptyPlaceholder } = this;
        const { projectId, token } = this.context.blinkloader;
        const { width, height } = this.state;
        const imagePayload = { width, height, src, projectId, token, pageUrl: window.location.href };
        Blinkloader.getSvgImage(imagePayload).then(function(svgUrl){
          setSrcValue(svgUrl, 'blnk-fadein', {isPlaceholder: true});
        }).catch(function (svgErr) {
          setSrcValue(src, 'blnk-visible');
        });
      }
    } else {
      console.error('Blinkloader Error! Couldn\'t optimize assets: missing "https://cdn.blinkloader.com/blinkloader-1.0.4.min.js" in page head.')
      this.setSrcValue(src, 'blnk-visible');
    }
  }

  componentDidMount() {
    const { progressive, lazyload } = this.props;
    const { imgPlaceholder } = this;
    if (imgPlaceholder) {
      const { height, width } = imgPlaceholder;
      this.setState({initialRender: false, height, width });
      if (progressive === false) {
        if (lazyload === false || !(typeof Blinkloader !== 'undefined' && Blinkloader.version === '1.0.4')) {
          this.renderRelevantImage();
        } else {
          Blinkloader.addVisibilityListener(imgPlaceholder, this.renderRelevantImage);
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { initialRender, placeholderTriggered } = this.state;
    const { imgElement, imgPlaceholder, setSrcValue } = this;
    const { progressive, lazyload } = this.props;
    if (progressive !== false) {
      if (placeholderTriggered === true && prevState.placeholderTriggered === false) {
        if (lazyload === false || !(typeof Blinkloader !== 'undefined' && Blinkloader.version === '1.0.4')) {
          this.renderRelevantImage();
        } else {
          Blinkloader.addVisibilityListener(imgElement, this.renderRelevantImage);
        }
      }
      if (prevState.initialRender !== initialRender) {
        if (lazyload === false || !(typeof Blinkloader !== 'undefined' && Blinkloader.version === '1.0.4')) {
          this.renderRelevantSvgImage();
        } else {
          Blinkloader.addVisibilityListener(imgPlaceholder, this.renderRelevantSvgImage);
        }
      }
    }
  }

  setImagePlaceholder(el) {
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
      return <img style={{width: width}} src={imgPlaceholder} ref={this.setImagePlaceholder} className={className} {...inheritedProps} />;
    } else {
      return imgSrc && <img style={{width: width}} src={imgSrc} ref={this.setImageElement} className={className + ` ${additionalImgClasses}`} {...inheritedProps} />;
    }
  }
}

export default Img;
