import { h } from 'preact';

import { TWidgetSize } from '../../../types';

import Paper from '../../../components/Paper';
import TextWithLabel from '../../../components/TextWithLabel';

interface IWidgetSpecificationProps {
  size?: TWidgetSize;
}

const WidgetSpecification = ({ size }: IWidgetSpecificationProps) => (
  <div style={{ flex: 1, padding: '10px' }}>
    <h2>Widget Specification</h2>
    <div class="row" style={{ justifyContent: 'space-between' }}>
      <Paper style={{ width: '45%' }}>
        <TextWithLabel label="SIZE" text={size} />
      </Paper>
      <Paper style={{ width: '45%' }}>
        <TextWithLabel label="TYPE" text="Text" />
      </Paper>
    </div>
  </div>
);

export default WidgetSpecification;
