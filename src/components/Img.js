import React from 'react';
import PropTypes from 'prop-types';

const contextTypes = {
  blinkloader: PropTypes.shape({
    userId: PropTypes.string,
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
      initialRender: true
    };
    this.setSrcValue = this.setSrcValue.bind(this);
    this.renderRelevantImage = this.renderRelevantImage.bind(this);
    this.setCustomClass = this.setCustomClass.bind(this);
  }

  setSrcValue(url, classes) {
    classes = classes || '';
    this.setState({imgSrc: url, additionalImgClasses: classes})
  }

  setCustomClass(classes) {
    classes = classes || '';
    this.setState({additionalImgClasses: classes})
  }

  renderRelevantImage() {
    const { setSrcValue, setCustomClass } = this;
    const { userId, token } = this.context.blinkloader;
    const { src } = this.props;
    const { width, height } = this.state;
    const imagePayload = { width, height, src, userId, token, pageUrl: window.location.href };
    const loadEverythingElse = (svgUrl) => {
      Blinkloader.getImage(imagePayload).then(function(url){
        if (svgUrl) {
          setSrcValue(svgUrl, 'blnk-fadeout');
        }
        setTimeout(function () {
          setSrcValue(url, 'blnk-fadein');
        }, 800);
      }).catch(function(errorMessage){
        if (svgUrl) {
          setSrcValue(svgUrl, 'blnk-fadeout');
        }
        setTimeout(function () {
          setSrcValue(src, 'blnk-fadein');
        }, 800);
      })
    }

    Blinkloader.getSvgImage(imagePayload).then(function(svgUrl){
      setSrcValue(svgUrl, 'blnk-fadein');
      loadEverythingElse(svgUrl);
    }).catch(function (svgError) {
      loadEverythingElse();
    });
  }

  componentDidMount() {
    const { imgPlaceholder } = this;
    if (imgPlaceholder) {
      const { height, width } = imgPlaceholder;
      this.setState({initialRender: false, height, width });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { initialRender } = this.state;
    prevState.initialRender !== initialRender && this.renderRelevantImage();
  }

  render() {
    const { width, src, className, ...inheritedProps } = this.props;
    const { imgSrc, initialRender, additionalImgClasses } = this.state;
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    if (initialRender === true) {
      return <img style={{width: width}} src={imgPlaceholder} ref={c => this.imgPlaceholder = c} className={className} {...inheritedProps} />;
    } else {
      return imgSrc && <img style={{width: width}} src={imgSrc}  className={className + ` ${additionalImgClasses}`} {...inheritedProps} />;
    }
  }
}

export default Img;
