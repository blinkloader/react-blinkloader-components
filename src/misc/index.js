const blinkloaderVersion = '2.0.2';
const noBlinkloaderJs = 'Blinkloader Error! Couldn\'t optimize assets: missing "https://cdn.blinkloader.com/blinkloader-' + blinkloaderVersion + '.min.js" in page head.';

const noBlinkloaderProjectId = 'Blinkloader can not render images without a project id. Make sure that all of your components are wrapped in BlinkloaderProvider with appropriate settings.';

const srcPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABnRSTlMA/wD/AP83WBt9AAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';

export {
  noBlinkloaderJs,
  blinkloaderVersion,
  noBlinkloaderProjectId,
  srcPlaceholder
};
