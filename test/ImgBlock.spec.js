import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import ImgBlock from '../src/components/ImgBlock.js';
import { setup } from './pseudo_window';

describe('ImgBlock component', function () {
  beforeEach(function() {
    setup();
  });

  it('calls componentDidMount', function() {
    spy(ImgBlock.prototype, 'componentDidMount');
    const imgWrapper = mount(<ImgBlock src={"test-src"} />)
    expect(ImgBlock.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('renders placeholder', function(done) {
    const imgBlockWrapper = mount(<ImgBlock src={"test-src"} style={{position: "absolute"}} />)

    setTimeout(function() {
      imgBlockWrapper.update();
      expect(imgBlockWrapper.html()).to.equal('<div style="position: absolute; width: 100px; background-size: cover; background-position: center; background-repeat: no-repeat; background-image: url(test-src);" class=""></div>');
      done();
    }, 1000)
  });
});
