import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Img from '../src/components/Img.js'
import { setup } from './pseudo_window';

describe('Img component', function () {
  beforeEach(function() {
    setup();
  });

  it('calls componentDidMount', function() {
    spy(Img.prototype, 'componentDidMount');
    const imgWrapper = mount(<Img src={"test-src"} width={300} />)
    expect(Img.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('renders placeholder', function(done) {
    const imgWrapper = mount(<Img src={"test-src"} width={300} style={{position: "absolute"}} />)

    setTimeout(function() {
      imgWrapper.update();
      expect(imgWrapper.html()).to.equal('<img src="test-src" style="position: absolute;" class="" width="300">');
      done();
    }, 1000)
  });
});
