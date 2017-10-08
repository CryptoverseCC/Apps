import React from 'react';
import * as classnames from 'classnames';

import Icon from '@userfeeds/apps-components/src/Icon';
import Button from '@userfeeds/apps-components/src/Button';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { IWidgetState } from '../../../ducks/widget';

import EthereumLogo from '../../../components/EthereumLogo';

import * as style from './widgetSummary.scss';

interface IWidgetSummaryProps {
  web3Enabled: {
    enabled: boolean;
    reason?: string;
  };
  openInNewWindowHidden?: boolean;
  widgetSettings: IWidgetState;
  onAddClick(): void;
  onOpenInSeparateWindow(): void;
}

const WidgetSummary = ({ web3Enabled, widgetSettings, onAddClick, onOpenInSeparateWindow,
  openInNewWindowHidden }: IWidgetSummaryProps) => (
  <div class={style.self}>
    <div class={style.header}>
      <div>
        <div class={style.title}>
          <EthereumLogo class={style.logo} />
          <div>
            <h2>{widgetSettings.title}</h2>
            <p>{widgetSettings.description}</p>
          </div>
          {!openInNewWindowHidden && <button onClick={onOpenInSeparateWindow} class={style.openInNewWindow}>
            <Icon name="external-link" />
          </button>}
        </div>
      </div>
      <Tooltip class={style.addButtonContainer} text={web3Enabled.reason}>
        <Button class={style.addButton} disabled={!web3Enabled.enabled} onClick={onAddClick}>
          ⊕ Add New Link
        </Button>
      </Tooltip>
    </div>
    <div class={style.boxes}>
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
