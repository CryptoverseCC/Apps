import { h } from 'preact';

import * as style from './ethereumLogo.scss';
import * as ethereum from '../images/ethereum.png';

const EthereumLogo = () => (
  <img class={style.self} src={ethereum} />
);

export default EthereumLogo;
