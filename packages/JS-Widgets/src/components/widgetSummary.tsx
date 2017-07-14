import { h } from 'preact';

import Button from './button';
import EthereumLogo from './ethereumLogo';
import TextWithLabel from './textWithLabel';

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
    <div class={`${style.boxes} row`}>
      <TextWithLabel label="Impressions" text="20000 monthly" />
      <TextWithLabel label="Source Domain" text="http://userfeeds.io" />
      <TextWithLabel label="Contact" text="spam@userfeeds.io" />
      <TextWithLabel label="Valid till" text="05/06/2018" />
    </div>
  </div>
);

export default WidgetSummary;
