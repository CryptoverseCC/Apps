import { h } from 'preact';

const If = ({ condition, children }) => {
  if (condition && children.length === 1) {
    return children[0];
  } else if (condition) {
    return <div>{children}</div>;
  }

  return null;
};

export default If;
