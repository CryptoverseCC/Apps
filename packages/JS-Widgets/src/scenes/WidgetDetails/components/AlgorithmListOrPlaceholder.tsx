import { h } from 'preact';

import conditionalComponent from '../../../components/hocs/if';

import Icon from '../../../components/Icon';
import Paper from '../../../components/Paper';

import LinksList from './LinksList';

import * as style from './algorithmListOrPlaceholder.scss';

const Placeholder = () => (
  <div class={style.self}>
    <h2>Algorithm</h2>
    <div class={style.content}>
      <Icon name="ban" class={style.ban} />
      <div class={style.info}>You don't see here anything because this widget has configured whitelist</div>
    </div>
  </div>
);

export default conditionalComponent(LinksList, Placeholder);
