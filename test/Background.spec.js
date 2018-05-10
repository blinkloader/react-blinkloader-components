import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Background from '../src/components/Background';
import { setup } from './pseudo_window';

describe('Background component', function () {
  beforeEach(function() {
    setup();
  });

  it('calls componentDidMount', function() {
    spy(Background.prototype, 'componentDidMount');
    const bgWrapper = mount(<Background src={"test-src"} />)
    expect(Background.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('renders placeholder', function(done) {
    const bgWrapper = mount(<Background src={"test-src"} />)

    setTimeout(function() {
      bgWrapper.update();
      expect(bgWrapper.html()).to.equal('<div class="" style="width: 100px; background-repeat: no-repeat; background-size: cover; background-image: url(test-src);"></div>');
      done();
    }, 1000)
  });
});
