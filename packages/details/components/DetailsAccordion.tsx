import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { ILink, IRemoteLink } from '@linkexchange/types/link';
import { TokenDetailsProviderWithInfura } from '@linkexchange/token-details-provider';
import Pill from '@linkexchange/components/src/Pill';
import Paper from '@linkexchange/components/src/Paper';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import Accordion from '@linkexchange/components/src/Accordion';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';

import { EWidgetSize, IWidgetSettings } from '@linkexchange/types/widget';

import SimpleLinksList from './SimpleLinksList';
import UserfeedsAddressInfo from './UserfeedsAddressInfo';

import * as style from './detailsAccordion.scss';

interface IDetailsAccordinProps {
  widgetSettings: IWidgetSettings;
  whitelistedLinksCount: number;
  allLinksCount: number;
  hasWhitelist: boolean;
  links: ILink[];
  whitelistedLinks: IRemoteLink[];
  allLinks: IRemoteLink[];
}

export default class DetailsAccordion extends Component<IDetailsAccordinProps, {}> {
  render() {
    const {
      widgetSettings,
      whitelistedLinksCount,
      allLinksCount,
      hasWhitelist,
      links,
      whitelistedLinks,
      allLinks,
    } = this.props;

    return (
      <div className={style.self}>
        <Paper>
          <Accordion
            className={style.accordion}
            title={
              <p className={style.accordionHeader}>
                <FormattedMessage id="list.slots.title" /> <Pill>{widgetSettings.slots}</Pill>
              </p>
            }
          >
            <SimpleLinksList asset={widgetSettings.asset} links={links} />
          </Accordion>
        </Paper>
        <Paper>
          <Accordion
            className={style.accordion}
            title={
              <p className={style.accordionHeader}>
                <FormattedMessage id="list.approved.title" /> <Pill>{whitelistedLinksCount}</Pill>
              </p>
            }
          >
            <SimpleLinksList asset={widgetSettings.asset} links={whitelistedLinks} />
          </Accordion>
        </Paper>
        {!hasWhitelist && (
          <Paper>
            <Accordion
              className={style.accordion}
              title={
                <p className={style.accordionHeader}>
                  <FormattedMessage id="list.algorithm.title" /> <Pill>{allLinksCount}</Pill>
                </p>
              }
            >
              <SimpleLinksList asset={widgetSettings.asset} links={allLinks} />
            </Accordion>
          </Paper>
        )}
        <Paper>
          <Accordion
            open
            className={style.accordion}
            title={
              <p className={style.accordionHeader}>
                <FormattedMessage id="widgetSpecification.title" />
              </p>
            }
          >
            <div className={style.widgetSpecification}>
              <TextWithLabel label="Size" text={widgetSettings.size} />
              <TextWithLabel label="Type" text="Text" />
              <TextWithLabel label="Token">
                <TokenLogo className={style.tokenLogo} asset={widgetSettings.asset} />
                <TokenDetailsProviderWithInfura asset={widgetSettings.asset} render={({ name }) => name} />
              </TextWithLabel>
              <TextWithLabel label="Algorithm" text="Text" />
            </div>
          </Accordion>
        </Paper>
        <Paper>
          <Accordion
            open
            className={style.accordion}
            title={
              <p className={style.accordionHeader}>
                <FormattedMessage id="userfeedsAddressInfo.title" />
              </p>
            }
          >
            <TextWithLabel label="Userfeed address" text={widgetSettings.recipientAddress} />
          </Accordion>
        </Paper>
      </div>
    );
  }
}
