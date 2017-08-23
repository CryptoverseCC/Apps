import { h } from 'preact';

import Icon from '@userfeeds/apps-components/src/Icon';
import RadioButtonGroup from '@userfeeds/apps-components/src/RadioButtonGroup';

import Section from '../Section';

import * as style from './type.scss';

const Soon = () => (
  <span class={style.soon}>Soon</span>
);

const WidgetOptions = ({ option }) => (
  <div class={style.widgetType}>
    <span>{option.label} {option.disabled && <Soon />}</span>
    <Icon class={style.typeIcon} name={option.value} />
  </div>
);

export const WIDGET_TYPES = [{
  value: 'text',
  label: 'Text',
  component: WidgetOptions,
}, {
  value: 'image',
  label: 'Image',
  disabled: true,
  component: WidgetOptions,
}, {
  value: 'video',
  label: 'Video',
  disabled: true,
  component: WidgetOptions,
}];

const Type = ({ value, onChange }) => (
  <Section header="Widget type" description="Add description here about widgets types">
    <RadioButtonGroup
      name="widgetType"
      value={value}
      options={WIDGET_TYPES}
      onChange={onChange}
    />
  </Section>
);

export default Type;
