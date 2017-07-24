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
      <Paper style={{ flex: 1, marginRight: '15px' }}>
        <TextWithLabel label="Size" text={size} />
      </Paper>
      <Paper style={{ flex: 1, marginLeft: '15px' }}>
        <TextWithLabel label="Type" text="Text" />
      </Paper>
    </div>
    <Paper>
      <TextWithLabel label="Algorithm">
        Text
      </TextWithLabel>
    </Paper>
  </div>
);

export default WidgetSpecification;
