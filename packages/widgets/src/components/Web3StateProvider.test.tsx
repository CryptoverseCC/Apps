import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Web3StateProvider } from './Web3StateProvider';

Enzyme.configure({
  adapter: new Adapter(),
});

describe('Web3StateProvider', () => {
  it('calls render block with Web3State and reason', () => {
    const render = jest.fn();
    const web3State = { enabled: false, reason: ':(' };
    const context = shallow(<Web3StateProvider render={render} web3State={web3State} />);
    expect(render).toBeCalledWith(web3State);
  });

  it('renders passed block', () => {
    const renderedElement = <div>test</div>;
    const render = jest.fn().mockReturnValue(renderedElement);
    const web3State = { enabled: false, reason: ':(' };
    const context = shallow(<Web3StateProvider render={render} web3State={web3State} />);
    expect(context.contains(renderedElement)).toBeTruthy();
  });
});
