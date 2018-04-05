import React from 'react';
import { shallow, mount, render } from 'enzyme';

jest.dontMock('../components/Img');

const Img = require('../components/Img');

describe("Img component test suite", function() {
  it("contains spec with an expectation", function() {
    expect(shallow(<Img />).contains(<div className="foo" />)).toBe(true);
  });
});
