import React from 'react';
import {render} from 'react-dom';

import { Img, BlinkloaderProvider } from '../src/index';

const App = () => {
  return (<div>
    <Img
      src={"http://stories.forbestravelguide.com/wp-content/uploads/2012/01/Spring-Exterior-5MB-e13256987851862.jpg"}
      width={300}
      progressive={true}
      lazyload={true}
    />
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
