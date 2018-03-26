import React, { Component } from 'react';
import styled from 'styled-components';

import { styledComponentWithProps } from '../utils';

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eaeef2;
`;

const FancyHrLine = styledComponentWithProps<{ left?: boolean }, HTMLDivElement>(Hr.extend)`
  background: ${(props) =>
    props.left
      ? 'linear-gradient(to left, rgba(116, 95, 181, 0.2), transparent 90%)'
      : 'linear-gradient(to right, rgba(116, 95, 181, 0.2), transparent 90%)'};
`;

export class FancyHr extends Component<{ left?: boolean }, { width?: string }> {
  state = { width: '' };
  intervalId?: number;

  componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  render() {
    return (
      <div style={{ widht: '100%', height: '1px', position: 'relative' }} ref={this.onRef}>
        <FancyHrLine
          left={this.props.left}
          style={{
            position: 'absolute',
            [this.props.left ? 'right' : 'left']: '0',
            width: `${this.state.width}`,
          }}
        />
      </div>
    );
  }

  private onRef = (ref: HTMLDivElement) => {
    this.intervalId = window.setInterval(() => {
      if (!ref) {
        return;
      }
      const box = ref.getBoundingClientRect();
      if (!box.left || !box.right) {
        return;
      }

      let width = '';
      if (this.props.left) {
        width = `${box.right - 10}px`;
      } else {
        width = `calc(100vw - ${box.left}px - 10px)`;
      }
      this.setState({ width });
    }, 100);
  };
}

export default Hr;
