import React from 'react';
import {render} from 'react-dom';

import { Img, BlinkloaderProvider } from '../src/index';

const App = () => {
  return (<div>
    <Img src='test-src' width={300} />
    <Img src='test-src' width={300} />
    </div>)
};

render(
  <BlinkloaderProvider
    projectId={process.env.BLINKLOADER_DEV_PROJECT_ID}
    token={process.env.BLINKLOADER_DEV_TOKEN}
  >
    <App />
  </BlinkloaderProvider>,
  document.querySelector('.App')
);
