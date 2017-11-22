import React from 'react';

import A from '@linkexchange/components/src/A';
import Icon from '@linkexchange/components/src/Icon';
import { IWidgetState } from '@linkexchange/ducks/widget';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import Web3StateProvider from '@linkexchange/web3-state-provider';

import * as style from './widgetSummary.scss';

interface IWidgetSummaryProps {
  openInNewWindowHidden?: boolean;
  widgetSettings: IWidgetState;
  onAddClick(): void;
  onOpenInSeparateWindow(): void;
}

const WidgetSummary = ({
  widgetSettings,
  onAddClick,
  onOpenInSeparateWindow,
  openInNewWindowHidden,
}: IWidgetSummaryProps) => {
  const [desiredNetwork] = widgetSettings.asset.split(':');

  return (
    <div className={style.Head}>
      <div className={style.UpperHead}>
        <TokenLogo className={style.Logo} asset={widgetSettings.asset} />
        <div className={style.Summary}>
          <div className={style.HeaderContainer}>
            <h1 className={style.Header}>{widgetSettings.title}</h1>
            {!openInNewWindowHidden && (
              <Button outline size="small" className={style.NewWindowButton} onClick={onOpenInSeparateWindow}>
                <Icon name="external-link" />New Window
              </Button>
            )}
          </div>
          <p className={style.BigScreenDescription}>{widgetSettings.description}</p>
        </div>
        <p className={style.SmallScreenDescription}>{widgetSettings.description}</p>
        <Web3StateProvider
          desiredNetwork={desiredNetwork}
          render={({ enabled, reason }) => (
            <Tooltip className={style.NewButtonContainer} text={reason}>
              <Button onClick={onAddClick} disabled={!enabled} color="primary">
                <Icon name="plus" /> Create new link
              </Button>
            </Tooltip>
          )}
        />
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
};
export default WidgetSummary;
