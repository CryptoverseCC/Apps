import { h } from 'preact';

import Icon from '@userfeeds/apps-components/src/Icon';

import * as style from './backButton.scss';

const BackButton = (props) => (
  <div class={style.self} {...props}>
    <Icon name="arrow-left"/> Widget details
  </div>
);

export default BackButton;
