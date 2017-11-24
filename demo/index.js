console.log('yo')

import React from 'react';
import {render} from 'react-dom';

import { Img } from '../src/index';

const App = () => {
  return <Img src='https://example.com/13772_draper-associates.png' userId={1039841217} />;
};
render(<App />, document.querySelector('.App'));
