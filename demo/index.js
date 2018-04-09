import React from 'react';
import {render} from 'react-dom';

import { Img, BlinkloaderProvider } from '../src/index';

const App = () => {
  return (<div>
    <Img
      src={"http://stories.forbestravelguide.com/wp-content/uploads/2012/01/Spring-Exterior-5MB-e13256987851862.jpg"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"https://kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"http://universalimagesonline.com/velassaru/06-spa/pix/Yoga.jpg"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"http://www.riovistajamaica.com/wp-content/uploads/2015/08/2015-12-26-125958.jpg"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"https://cdn-enterprise.discourse.org/twitter/uploads/default/original/2X/9/9863c5060f0bb427b301719db4d0cc5c5a5f0e68.JPG"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"http://www.skybury.com.au/files/media/original/004/461/c60/Skybury%20coffee%20berries%20close%20HR.jpg"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"http://www.skybury.com.au/files/media/original/080/231/ffa/SKybury%20Hero.jpg"}
      width={300}
      style={{display: 'block', height: '250px'}}
    />
    <Img
      src={"http://www.skybury.com.au/files/media/original/070/f82/676/Skybury%20building%20pano%20HR.jpg"}
      width={300}
      className={"skybury"}
      style={{display: 'block', height: '250px'}}
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
