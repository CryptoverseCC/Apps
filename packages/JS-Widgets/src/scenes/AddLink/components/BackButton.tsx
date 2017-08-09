import { h } from 'preact';

import Icon from '../../../components/Icon';

import * as style from './backButton.scss';

const BackButton = (props) => (
  <div class={style.self} {...props}>
    <Icon name="arrow-left"/> Widget details
  </div>
);

export default BackButton;
