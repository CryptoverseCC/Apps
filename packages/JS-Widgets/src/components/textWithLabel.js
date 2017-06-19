import { h } from 'preact';

import './textWithLabel.css';

import Label from './label';

const TextWithLabel = ({ label, text, children }) => {
  return (
    <div class="text-with-label">
      <Label>{label}</Label>
      <p class="text">{text || children}</p>
    </div>
  );
};

export default TextWithLabel;
