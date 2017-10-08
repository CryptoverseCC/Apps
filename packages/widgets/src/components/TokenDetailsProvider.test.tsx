import React from 'react';
import { shallow } from 'enzyme';
import { TokenDetailsProvider } from './TokenDetailsProvider';

describe('TokenDetailsProvider', () => {
  const defaultTokenDetails = { loaded: false, decimals: null };

  const renderContext = ({
    render = jest.fn(),
    tokenDetails = defaultTokenDetails,
    loadTokenDetails = jest.fn(),
  }) =>
    shallow(
      <TokenDetailsProvider
        render={render}
        tokenDetails={tokenDetails}
        loadTokenDetails={loadTokenDetails}
      />,
    );

  it('calls loadTokenDetails on mount', () => {
    const loadTokenDetails = jest.fn();
    renderContext({ loadTokenDetails });
    expect(loadTokenDetails).toBeCalled();
  });
  it('does not call render when tokenDetails are not loaded', () => {
    const render = jest.fn();
    renderContext({ render });
    expect(render).not.toBeCalled();
  });
  it('calls render block with tokenDetails when tokenDetails are loaded', () => {
    const render = jest.fn();
    const tokenDetails = { ...defaultTokenDetails, loaded: true };
    renderContext({ render, tokenDetails });
    expect(render).toBeCalledWith(tokenDetails);
  });
  it('renders passed block', () => {
    const renderedElement = <div>test</div>;
    const render = jest.fn().mockReturnValue(renderedElement);
    const tokenDetails = { ...defaultTokenDetails, loaded: true };
    const context = renderContext({ render, tokenDetails });
    expect(context.contains(renderedElement)).toBeTruthy();
  });
});
