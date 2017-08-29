import { h } from 'preact';
import * as classnames from 'classnames';

import Icon from '@userfeeds/apps-components/src/Icon';
import Button from '@userfeeds/apps-components/src/Button';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { IWidgetState } from '../../../reducers/widget';

import EthereumLogo from '../../../components/EthereumLogo';

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
    <div class={classnames(style.header, 'row')}>
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
        label={<span><Icon name="link-intact" /> Widget location</span>}
      >
        <a href={widgetSettings.location}>{widgetSettings.location}</a>
      </TextWithLabel>
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="envelope-open" /> Contact</span>}
        text={widgetSettings.contactMethod || '-'}
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="calendar" /> Valid till</span>}
        text={widgetSettings.tillDate || '-'}
      />
    </div>
  </div>
);

export default WidgetSummary;
