import React from 'react';
import {shallow} from 'enzyme';
import Button from './index';

test('it renders', () => {
  const wrapper = shallow(<Button>Hey</Button>);
  expect(wrapper.contains('Hey')).toBe(true);
});
