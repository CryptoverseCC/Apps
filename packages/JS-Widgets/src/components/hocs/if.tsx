import { h } from 'preact';

const conditionalComponent = (TrulyComponent, FalselyComponent) => ({ condition, ...restProps }) => {
  if (condition) {
    return <TrulyComponent {...restProps} />;
  } else if (FalselyComponent) {
    return <FalselyComponent {...restProps} />;
  }

  return null;
};

export default conditionalComponent;
