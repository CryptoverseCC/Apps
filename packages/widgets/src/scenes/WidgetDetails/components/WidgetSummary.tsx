import React from 'react';
// import classnames from 'classnames';
//
import Icon from '@userfeeds/apps-components/src/Icon';
import A from '@userfeeds/apps-components/src/A';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';
// import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';
//
import { IWidgetState } from '../../../ducks/widget';
//
import EthereumLogo from '../../../components/EthereumLogo';

import * as style from './widgetSummary.scss';
import Button from '@userfeeds/apps-components/src/NewButton';

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

const WidgetSummary = ({
  web3Enabled,
  widgetSettings,
  onAddClick,
  onOpenInSeparateWindow,
  openInNewWindowHidden,
}: IWidgetSummaryProps) => (
  <div className={style.Head}>
    <div className={style.UpperHead}>
      <EthereumLogo className={style.Logo} />
      <div className={style.Summary}>
        <div className={style.HeaderContainer}>
          <h1 className={style.Header}>{widgetSettings.title}</h1>
          {!openInNewWindowHidden && (
            <Button
              outline
              size="small"
              className={style.NewWindowButton}
              onClick={onOpenInSeparateWindow}
            >
              <Icon name="external-link" />New Window
            </Button>
          )}
        </div>
        <p className={style.BigScreenDescription}>{widgetSettings.description}</p>
      </div>
      <p className={style.SmallScreenDescription}>{widgetSettings.description}</p>
      <Tooltip className={style.NewButtonContainer} text={web3Enabled.reason}>
        <Button onClick={onAddClick} disabled={!web3Enabled.enabled}>
          <Icon name="plus" /> Create new link
        </Button>
      </Tooltip>
    </div>
    <div className={style.lowerHead}>
      <div className={style.SummaryField}>
        <div className={style.InnerSummaryField}>
          <Icon name="eye" /> Declared impressions:
          <p>
            <span className={style.RegularText}>{widgetSettings.impression}</span>
          </p>
        </div>
      </div>
      <div className={style.SummaryField}>
        <div className={style.InnerSummaryField}>
          <Icon name="link-intact" /> Source Domain:
          <p>
            <A href={widgetSettings.location}>{widgetSettings.location}</A>
          </p>
        </div>
      </div>
      <div className={style.SummaryField}>
        <div className={style.InnerSummaryField}>
          <Icon name="envelope-open" /> Contact:
          <p>
            <span className={style.RegularText}>{widgetSettings.contactMethod || '-'}</span>
          </p>
        </div>
      </div>
      <div className={style.SummaryField}>
        <div className={style.InnerSummaryField}>
          <Icon name="calendar" /> Valid till:
          <p>
            <span className={style.RegularText}>{widgetSettings.tillDate || '-'}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);
export default WidgetSummary;
