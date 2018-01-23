import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from '@linkexchange/components/src/A';
import Icon from '@linkexchange/components/src/Icon';
import { IWidgetState } from '@linkexchange/ducks/widget';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import Web3StateProvider from '@linkexchange/web3-state-provider';

import * as style from './widgetSummary.scss';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';

const InjectedWeb3StateProvider = withInjectedWeb3(Web3StateProvider);

interface IWidgetSummaryProps {
  onAddClick(): void;
  widgetSettings: IWidgetState;
  openInNewWindowHidden?: boolean;
  onOpenInSeparateWindow?: () => void;
}

const WidgetSummary = ({
  widgetSettings,
  onAddClick,
  onOpenInSeparateWindow,
  openInNewWindowHidden,
}: IWidgetSummaryProps) => {
  return (
    <div className={style.Head}>
      <div className={style.UpperHead}>
        <TokenLogo className={style.Logo} asset={widgetSettings.asset} />
        <div className={style.Summary}>
          <div className={style.HeaderContainer}>
            <h1 className={style.Header}>{widgetSettings.title}</h1>
            {!openInNewWindowHidden && (
              <Button outline size="small" className={style.NewWindowButton} onClick={onOpenInSeparateWindow}>
                <Icon name="external-link" />
                <FormattedMessage id="widgetSummary.openInNewWindow" defaultMessage="New Window" />
              </Button>
            )}
          </div>
          <p className={style.BigScreenDescription}>{widgetSettings.description}</p>
        </div>
        <p className={style.SmallScreenDescription}>{widgetSettings.description}</p>
        <InjectedWeb3StateProvider
          asset={widgetSettings.asset}
          render={({ enabled, reason }) => (
            <Tooltip className={style.NewButtonContainer} text={reason}>
              <Button onClick={onAddClick} disabled={!enabled} color="primary">
                <Icon name="plus" /> <FormattedMessage id="widgetSummary.addLink" defaultMessage="Create new link" />
              </Button>
            </Tooltip>
          )}
        />
      </div>
      <div className={style.LowerHead}>
        <div className={style.SummaryField}>
          <div className={style.InnerSummaryField}>
            <Icon name="eye" />{' '}
            <FormattedMessage id="widgetSummary.declaredImpression" defaultMessage="Declared impressions" />:
            <p>
              <span className={style.RegularText}>{widgetSettings.impression}</span>
            </p>
          </div>
        </div>
        <div className={style.SummaryField}>
          <div className={style.InnerSummaryField}>
            <Icon name="link-intact" />{' '}
            <FormattedMessage id="widgetSummary.sourceDomain" defaultMessage="Source Domain" />:
            <p>
              <A href={widgetSettings.location}>{widgetSettings.location}</A>
            </p>
          </div>
        </div>
        <div className={style.SummaryField}>
          <div className={style.InnerSummaryField}>
            <Icon name="envelope-open" /> <FormattedMessage id="widgetSummary.contact" defaultMessage="Contact" />:
            <p>
              <span className={style.RegularText}>{widgetSettings.contactMethod || '-'}</span>
            </p>
          </div>
        </div>
        <div className={style.SummaryField}>
          <div className={style.InnerSummaryField}>
            <Icon name="calendar" /> <FormattedMessage id="widgetSummary.validTill" defaultMessage="Valid till" />:
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
