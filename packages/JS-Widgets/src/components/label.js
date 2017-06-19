import { h } from 'preact';

import './label.css';

const Label = ({ children }) => {
  return <p class="label">{children}</p>;
};

export default Label;
