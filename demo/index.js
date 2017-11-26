console.log('yo')

import React from 'react';
import {render} from 'react-dom';

import { Img, BlinkloaderProvider } from '../src/index';

const App = () => {
  return <Img src='https://www.common.com/static/images/community/community-5@2x.jpg' />;
};

render(<BlinkloaderProvider userId={process.env.BLINKLOADER_USER_ID} token={process.env.BLINKLOADER_DEV_TOKEN}>
  <App />
</BlinkloaderProvider>
, document.querySelector('.App'));
