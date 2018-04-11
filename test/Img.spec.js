import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Img from '../src/components/Img';
import Provider from '../src/components/provider';
import { setup } from './pseudo_window';

describe('Editor', function () {
  beforeEach(function() {
    setup();
  });

  it('calls componentDidMount', function() {
    spy(Img.prototype, 'componentDidMount');
    const wrapper = mount(<Img src={"test-src"} width={300} />)
    expect(Img.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('renders placeholder', function(done) {
    const wrapper = mount(<Img src={"test-src"} width={300} style={{position: "absolute"}} />)
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.html()).to.equal('<img src="test-src" style="width: 300px; position: absolute;" class=" blnk-visible">');
      done();
    }, 1000)
  })

  it('renders initial img src', function() {
    const wrapper = mount(<Img src={"test-src"} width={300} />)
    expect(wrapper.prop('src')).to.equal("test-src");
  })

  it('renders initial img if no Blinkloader object', function() {
    global.window.Blinkloader = null;
    const wrapper = mount(<Img src={"test-src"} width={300} />)
    expect(wrapper.prop('src')).to.equal("test-src");
  })

  it('renders 2 times', function(done) {
    spy(Img.prototype, 'componentDidUpdate');
    const wrapper = mount(<Img src={"test-src"} width={300} />)
    setTimeout(function() {
      wrapper.update();
      expect(Img.prototype.componentDidUpdate.calledOnce).to.equal(true);
      done();
    }, 1000)
  })

  it('renders div if asBackground is set', function(done) {
    const wrapper = mount(<Img src={"test-src"} width={300} asBackground />)
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.html()).to.equal('<div style="width: 300px; background-image: url(test-src); background-size: cover;" class=" blnk-visible"></div>')
      done();
    }, 1000)
  })

  it('renders initial image if progressive={true} is set and no svg and optimized image', function(done) {
    const wrapper = mount(
      <Img
        src={"http://stories.forbestravelguide.com/wp-content/uploads/2012/01/Spring-Exterior-5MB-e13256987851862.jpg"}
        progressive={true}     
        width={300} 
      />
    );
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.html()).to.equal('<img src="http://stories.forbestravelguide.com/wp-content/uploads/2012/01/Spring-Exterior-5MB-e13256987851862.jpg" style="width: 300px;" class=" blnk-visible">');
      done();
    }, 1000);
  })

  it('renders div if accelerate={true} is set', function(done) {
    const wrapper = mount(<Img src={"test-src"} width={300} accelerate={true} />);
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.html()).to.equal('<div style="width: 300px; background-image: url(test-src); background-size: cover;" class=" blnk-visible"></div>')
      done();
    }, 1000)
  })

  it('renders images in the right order when lazyload={true} is set', function(done) {
    const wrapper = mount(
      <Provider
        projectId={"test"}
        token={"test"}
      >
        <Img
          src={"http://stories.forbestravelguide.com/wp-content/uploads/2012/01/Spring-Exterior-5MB-e13256987851862.jpg"}
          width={300}
          testOffset={1000}
          lazyload={true}
        />
        <Img
          src={"https://kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"}
          width={300}
          testOffset={900}
          lazyload={true}
        />
        <Img
          src={"http://universalimagesonline.com/velassaru/06-spa/pix/Yoga.jpg"}
          width={300}
          testOffset={800}
          lazyload={true}
        />
        <Img
          src={"http://www.riovistajamaica.com/wp-content/uploads/2015/08/2015-12-26-125958.jpg"}
          width={300}
          testOffset={700}
          lazyload={true}
        />
        <Img
          src={"https://cdn-enterprise.discourse.org/twitter/uploads/default/original/2X/9/9863c5060f0bb427b301719db4d0cc5c5a5f0e68.JPG"}
          width={300}
          testOffset={600}
          lazyload={true}
        />
        <Img
          src={"http://www.skybury.com.au/files/media/original/004/461/c60/Skybury%20coffee%20berries%20close%20HR.jpg"}
          width={300}
          testOffset={500}
          lazyload={true}
        />
        <Img
          src={"http://www.skybury.com.au/files/media/original/080/231/ffa/SKybury%20Hero.jpg"}
          width={300}
          testOffset={400}
          lazyload={true}
        />
        <Img
          src={"http://www.skybury.com.au/files/media/original/082/e05/8c2/Skybury%20store%20HR.jpg"}
          width={300}
          testOffset={300}
          lazyload={true}
        />
        <Img
          src={"http://www.skybury.com.au/files/media/original/081/bab/b23/Skybury%20store%20again%20HR.jpg"}
          width={300}
          testOffset={200}
          lazyload={true}
        />
        <Img
          src={"http://www.skybury.com.au/files/media/original/070/f82/676/Skybury%20building%20pano%20HR.jpg"}
          width={300}
          testOffset={100}
          lazyload={true}
          className={"skybury"}
        />
      </Provider>
    );
    setTimeout(function() {
      wrapper.update();
      console.log("checkout the testOffset values order, it should go from 1 to 10");
      done();
    }, 1000)
  })
});
