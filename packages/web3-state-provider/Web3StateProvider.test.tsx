import React from 'react';
import { shallow } from 'enzyme';

// import Web3StateProvider from './index';

xdescribe('Web3StateProvider', () => {
  it('calls synchronizeState on mount', () => {
    const render = jest.fn();
    const synchronizeState = jest.fn();
    const web3State = { enabled: false, reason: ':(' };
    const context = shallow(
      <Web3StateProvider render={render} web3State={web3State} synchronizeState={synchronizeState} />,
    );
    expect(synchronizeState).toBeCalled();
  });

  it('calls render block with Web3State and reason', () => {
    const render = jest.fn();
    const synchronizeState = jest.fn();
    const web3State = { enabled: false, reason: ':(' };
    const context = shallow(
      <Web3StateProvider render={render} web3State={web3State} synchronizeState={synchronizeState} />,
    );
    expect(render).toBeCalledWith(web3State);
  });

  it('renders passed block', () => {
    const renderedElement = <div>test</div>;
    const render = jest.fn().mockReturnValue(renderedElement);
    const synchronizeState = jest.fn();
    const web3State = { enabled: false, reason: ':(' };
    const context = shallow(
      <Web3StateProvider render={render} web3State={web3State} synchronizeState={synchronizeState} />,
    );
    expect(context.contains(renderedElement)).toBeTruthy();
  });
});
