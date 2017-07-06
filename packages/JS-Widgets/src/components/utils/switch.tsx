import { h, Component, FunctionalComponent } from 'preact';

interface ISwitchProps {
  expresion: any;
}

interface ICaseProps {
  condition: any;
}

export default class Switch extends Component<ISwitchProps, {}> {

  static Case: FunctionalComponent<ICaseProps>  = ({ children }) => {
    if (children && children.length === 1) {
      return children[0];
    }
    return <div>{children}</div>;
  };

  render({ expresion, children }) {
    const child = children.find((c) => c.nodeName === Switch.Case &&
      c.attributes.condition === expresion);

    return child;
  }
}
