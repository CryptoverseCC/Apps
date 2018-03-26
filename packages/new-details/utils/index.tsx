import React, { Component } from 'react';
import { StyledFunction } from 'styled-components';

export function styledComponentWithProps<T, U extends HTMLElement = HTMLElement>(
  styledFunction: StyledFunction<React.HTMLProps<U>>,
): StyledFunction<T & React.HTMLProps<U>> {
  return styledFunction;
}

export const delayed = (ms: number) => <T extends {}>(Cmp: React.ComponentType<T>) =>
  class extends Component<T, { show: boolean }> {
    static displayName = `delayed(${Cmp.displayName || Cmp.name})`;
    timer?: number;
    state = {
      show: false,
    };

    componentDidMount() {
      if (ms > 0) {
        this.timer = window.setTimeout(this.showContent, ms);
      } else {
        this.showContent();
      }
    }

    componentWillUnmount() {
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
    }

    render() {
      if (!this.state.show) {
        return null;
      }

      return <Cmp>{this.props.children}</Cmp>;
    }

    private showContent = () => {
      this.setState({ show: true });
    };
  };
