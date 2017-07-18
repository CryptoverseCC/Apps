import { h } from 'preact';

import { TWidgetSize } from '../../../types';

import Paper from '../../../components/Paper';
import TextWithLabel from '../../../components/TextWithLabel';

import * as style from './widgetSpecification.scss';

interface IWidgetSpecificationProps {
  size?: TWidgetSize;
}

const WidgetSpecification = ({ size }: IWidgetSpecificationProps) => (
  <div class={style.self}>
    <div class="row" style={{ justifyContent: 'space-between' }}>
      <Paper style={{ flex: 1, marginRight: '10px' }}>
        <TextWithLabel label="SIZE" text={size} />
      </Paper>
      <Paper style={{ flex: 1, marginLeft: '10px' }}>
        <TextWithLabel label="TYPE" text="Text" />
      </Paper>
    </div>
    <Paper style={{ marginTop: '10px' }}>
      <TextWithLabel label="ALGORITHM">
        Text
      </TextWithLabel>
    </Paper>
  </div>
);

export default WidgetSpecification;
