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
    if (children && children.length === 1) {
      return children[0];
    }
    return <div>{children}</div>;
  }

  render() {
    const { expresion, children } = this.props;
    return Children.map((child) => {
      if (child.nodeName === Switch.Case && child.attributes.condition === expresion) {
        return child;
      }
      return null;
    });
  }
}
