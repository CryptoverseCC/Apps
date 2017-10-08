import React from 'react';
import * as classnames from 'classnames';

import RadioButtonGroup from '@userfeeds/apps-components/src/RadioButtonGroup';

import Section from '../Section';

import * as style from './size.scss';

const BannerSize = (props) => (
  <span class={style.bannerSizeLabel}>{props.children}</span>
);

const LeaderboardPictograph = () => (
  <div class={classnames(style.pictograph, style.leaderboard)}>
    <div class={style.fill70} />
  </div>
);

const RectanglePictograph = () => (
  <div class={classnames(style.pictograph, style.rectangle)}>
    <div class={style.fill90} />
    <div class={style.fill70} />
  </div>
);

export const WIDGET_SIZES = [{
  value: 'leaderboard',
  label: 'Leaderboard (728x90)',
  component: () => (
    <div>
      <span>Leaderboard <BannerSize>728x90</BannerSize></span>
      <LeaderboardPictograph />
    </div>
  ),
}, {
  value: 'rectangle',
  label: 'Medium rectangle (300x250)',
  component: () => (
    <div>
      <span>Rectangle <BannerSize>300x250</BannerSize></span>
      <RectanglePictograph />
    </div>
  ),
}];

const Size = ({ value, onChange }) => (
  <Section header="Select size" description="Add description here about widgets sizes">
    <RadioButtonGroup
      name="widgetSize"
      value={value}
      options={WIDGET_SIZES}
      onChange={onChange}
    />
  </Section>
);

export default Size;
