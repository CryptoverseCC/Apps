import { h } from 'preact';
import * as classnames from 'classnames';

import { IWidgetState } from '../../../reducers/widget';

import Icon from '../../../components/Icon';
import Button from '../../../components/Button';
import Tooltip from '../../../components/Tooltip';
import EthereumLogo from '../../../components/EthereumLogo';
import TextWithLabel from '../../../components/TextWithLabel';

import * as style from './widgetSummary.scss';

interface IWidgetSummaryProps {
  web3Enabled: {
    enabled: boolean;
    reason?: string;
  };
  widgetSettings: IWidgetState;
  onAddClick(): void;
  onOpenInSeparateWindow(): void;
}

const WidgetSummary = ({ web3Enabled, widgetSettings, onAddClick, onOpenInSeparateWindow }: IWidgetSummaryProps) => (
  <div class={style.self}>
    <div class="row">
      <EthereumLogo class={style.logo} />
      <div>
        <div class="row">
          <h2>{widgetSettings.title}</h2>
          <button onClick={onOpenInSeparateWindow} class={style.openInNewWindow}>
            <Icon name="external-link" /> New window
            </button>
        </div>
        <p>{widgetSettings.description}</p>
      </div>
      <Tooltip text={web3Enabled.reason} style={{ marginLeft: 'auto' }}>
        <Button class={style.addButton} disabled={!web3Enabled.enabled} onClick={onAddClick}>
          ⊕ Add New Link
        </Button>
      </Tooltip>
    </div>
    <div class={classnames(style.boxes, 'row')}>
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="eye" /> Impressions per day</span>}
        text={widgetSettings.impression}
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="link-intact" /> Source Domain</span>}
        text={widgetSettings.location}
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="envelope-open" /> Contact</span>}
        text={widgetSettings.publisherNote}
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="calendar" /> Valid till</span>}
        text={widgetSettings.tillDate}
      />
    </div>
  </div>
);

export default WidgetSummary;
