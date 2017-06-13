import { h } from 'preact';

import './input.css';

const Input = ({ placeholder, ...restProps }) => {
  return (
    <div class="input-container">
      <input class="input" required {...restProps} />
      <span class="placeholder">{placeholder}</span>
      <span class="highlight" />
    </div>
  );
};

export default Input;
