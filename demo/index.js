console.log('yo')

import React from 'react';
import {render} from 'react-dom';

import { Img, BlinkloaderProvider } from '../src/index';

const App = () => {
  return <Img src='https://pbs.twimg.com/profile_images/921702184210849792/sTQGwPtn_400x400.jpg' />;
};

render(<BlinkloaderProvider userId={process.env.BLINKLOADER_USER_ID} token={process.env.BLINKLOADER_DEV_TOKEN}>
  <App />
</BlinkloaderProvider>
, document.querySelector('.App'));
