import React, { Component, Children } from 'react';

interface ISwitchProps {
  expresion: any;
}

interface ICaseProps {
  condition: any;
}

// ToDo throw it away?

export default class Switch extends Component<ISwitchProps, {}> {

  static Case = ({ children }: ICaseProps) => {
    if (children && Children.count(children) === 1) {
      return Children.only(children);
    }
    return <div>{children}</div>;
  }

  render() {
    const { expresion, children } = this.props;

    return Children
      .toArray(children)
      .find((child) => child.props.condition === expresion);
  }
}
