import React, { Component, Children } from 'react';

interface ISwitchProps {
  expresion: any;
}

interface ICaseProps {
  condition: any;
  children?: JSX.Element | JSX.Element[];
}

// ToDo throw it away?

export default class Switch extends Component<ISwitchProps, {}> {

  static Case = ({ children }: ICaseProps) => {
    if (children && Children.count(children) === 1) {
      return Children.only(children);
    }
    return <>{children}</>;
  }

  render() {
    const { expresion, children } = this.props;

    const childToRender = Children
      .toArray(children)
      .find((child: React.ReactChild) => typeof child === 'object' && child.props.condition === expresion);

    return childToRender || null;
  }
}
