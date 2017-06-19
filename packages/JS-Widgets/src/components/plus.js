import { h } from 'preact';

import './plus.css';

const Plus = ({ reverseOnHover }) => {
  return <i class={'icon plus ' + (reverseOnHover ? 'reverse-on-hover' : '')} />;
};

export default Plus;
