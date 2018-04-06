import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Img from '../src/components/Img';
import { setup } from './pseudo_window';

describe('Editor', function () {
  beforeEach(function() {
    setup();
  });

  const testContext = {
    blinkloader: {
      "projectId": "test",
      "token": "test"
    }
  }

  it('calls componentDidMount', function() {
    spy(Img.prototype, 'componentDidMount');
    const wrapper = mount(<Img src={"test-src"} width={300} />, {
      context: testContext
    })
    expect(Img.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('renders placeholder', function(done) {
    const wrapper = mount(<Img src={"test-src"} width={300} />, {
      context: testContext
    })
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.html()).to.equal('<img src="test-src" style="width: 300px;" class=" blnk-visible">');
      done();
    }, 1000)
  })
  it('renders initial img src', function() {
    const wrapper = mount(<Img src={"test-src"} width={300} />, {
      context: testContext
    });
    expect(wrapper.prop('src')).to.equal("test-src");
  })
  it('renders 2 times', function(done) {
    spy(Img.prototype, 'componentDidUpdate');
    const wrapper = mount(<Img src={"test-src"} width={300} />, {
      context: testContext
    });
    setTimeout(function() {
      wrapper.update();
      expect(Img.prototype.componentDidUpdate.calledOnce).to.equal(true);
      done();
    }, 1000)
  })
});
