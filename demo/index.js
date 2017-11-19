console.log('yo')

import React from 'react';
import {render} from 'react-dom';

import { Img } from '../src/index';

const App = () => {
  return <Img src='https://cdn.blinkloader.com/2656743524/1716968120/20851_max-RL.png' />;
};
render(<App />, document.querySelector('.App'));
