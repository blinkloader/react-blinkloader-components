import React from 'react';

class Img extends React.Component {
  componentDidMount() {
    if (!Blinkloader || Blinkloader.version !== '1.0.5') {
      console.error('Blinkloader: blinkloader-1.0.5.min.js not found, optimizations may be not working correctly.')
    }
  }
  render() {
    const { width, src, progressive=true, lazyload=true, className, ...inheritedProps } = this.props;
    const imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';
    return src && <img style={{width: width}} src={imgPlaceholder} data-blnk-lazyload={lazyload} data-blnk-progressive={progressive} data-blnk-src={src} className={className + ` blnk-img`} {...inheritedProps} />;
  }
}

export default Img;
