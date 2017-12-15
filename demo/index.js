import React from 'react';
import {render} from 'react-dom';

import { Img, BlinkloaderProvider } from '../src/index';

const App = () => {
  return <Img src='https://www.common.com/static/images/why-common/laundry@2x.jpg' width={300} />;
};

render(<BlinkloaderProvider userId={process.env.BLINKLOADER_USER_ID} token={process.env.BLINKLOADER_DEV_TOKEN}>
  <App />
</BlinkloaderProvider>
, document.querySelector('.App'));
