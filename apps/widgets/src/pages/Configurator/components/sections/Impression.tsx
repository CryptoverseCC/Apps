import { h } from 'preact';

import RadioButtonGroup from '@userfeeds/apps-components/src/RadioButtonGroup';

import Section from '../Section';

export const WIDGET_IMPRESSIONS = [{
  value: 'N/A',
  label: 'N/A',
}, {
  value: '100 - 1.000',
  label: '100 - 1.000',
}, {
  value: '1.001 - 10.000',
  label: '1.001 - 10.000',
}, {
  value: '10.001 - 100.000',
  label: '10.001 - 100.000',
}, {
  value: '100.000 - 1 milion',
  label: '100.000 - 1 milion',
}, {
  value: '1 milion - ∞',
  label: '1 milion - ∞',
}];

const Impression = ({ value, onChange}) => (
  <Section
    header="Declared amount of Impressions"
    description="Add description here about declared amount of impressions"
  >
    <RadioButtonGroup
      name="impressions"
      value={value}
      options={WIDGET_IMPRESSIONS}
      onChange={onChange}
    />
  </Section>
);

export default Impression;
