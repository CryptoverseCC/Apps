import { h } from 'preact';

const Switch = ({ expresion, children }) => {
  const child = children.find((c) => c.nodeName === Switch.Case &&
    c.attributes.condition === expresion);

  return child;
};

Switch.Case = ({ children }) => {
  if (children.length === 1) {
    return children[0];
  }
  return <div>{children}</div>;
};

export default Switch;
