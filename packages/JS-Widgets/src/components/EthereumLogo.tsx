import { h } from 'preact';

import * as ethereum from '../images/ethereum.png';

const EthereumLogo = ({ class: className }) => (
  <img class={className} src={ethereum} />
);

export default EthereumLogo;
