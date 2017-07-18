import { h } from 'preact';
import * as classnames from 'classnames';

import Button from '../../../components/Button';
import EthereumLogo from '../../../components/EthereumLogo';
import TextWithLabel from '../../../components/TextWithLabel';

import * as style from './widgetSummary.scss';

interface IWidgetSummaryProps {
  onAddClick(): void;
}

const WidgetSummary = ({ onAddClick }: IWidgetSummaryProps) => (
  <div class={style.self}>
    <div class="row">
      <EthereumLogo />
      <div>
        <h2>Title of the widget</h2>
        <p>Place to describe widget</p>
      </div>
      <Button
        style={{ marginLeft: 'auto', padding: '0.5em' }}
        onClick={onAddClick}
      >
        ⊕ Add New Link
      </Button>
    </div>
    <div class={classnames(style.boxes, 'row')}>
      <TextWithLabel class={style.box} label="Impressions" text="20000 monthly" />
      <TextWithLabel class={style.box} label="Source Domain" text="http://userfeeds.io" />
      <TextWithLabel class={style.box} label="Contact" text="spam@userfeeds.io" />
      <TextWithLabel class={style.box} label="Valid till" text="05/06/2018" />
    </div>
  </div>
);

export default WidgetSummary;
