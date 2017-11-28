import React, { Component } from 'react';

import { ILink, IRemoteLink } from '@linkexchange/types/link';
import Pill from '@linkexchange/components/src/Pill';
import Paper from '@linkexchange/components/src/Paper';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import TokenName from '@linkexchange/components/src/TokenName';
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
    const { widgetSettings, whitelistedLinksCount, allLinksCount, hasWhitelist,
      links, whitelistedLinks, allLinks } = this.props;

    return (
      <div className={style.self}>
        <Paper>
          <Accordion
            className={style.accordion}
            title={<p className={style.accordionHeader}>Slots <Pill>{widgetSettings.slots}</Pill></p>}
          >
            <SimpleLinksList links={links} />
          </Accordion>
        </Paper>
        <Paper>
          <Accordion
            className={style.accordion}
            title={<p className={style.accordionHeader}>Whitelist <Pill>{whitelistedLinksCount}</Pill></p>}
          >
            <SimpleLinksList links={whitelistedLinks} />
          </Accordion>
        </Paper>
        { !hasWhitelist &&
          <Paper>
            <Accordion
              className={style.accordion}
              title={<p className={style.accordionHeader}>Algorithm <Pill>{allLinksCount}</Pill></p>}
            >
              <SimpleLinksList links={allLinks} />
            </Accordion>
          </Paper>
        }
        <Paper>
          <Accordion
            open
            className={style.accordion}
            title={<p className={style.accordionHeader}>Widget Specification</p>}
          >
            <div className={style.widgetSpecification}>
              <TextWithLabel label="Size" text={widgetSettings.size} />
              <TextWithLabel label="Type" text="Text" />
              <TextWithLabel label="Token">
                <TokenLogo className={style.tokenLogo} asset={widgetSettings.asset} />
                <TokenName asset={widgetSettings.asset} />
              </TextWithLabel>
              <TextWithLabel label="Algorithm" text="Text" />
            </div>
          </Accordion>
        </Paper>
        <Paper>
          <Accordion
            open
            className={style.accordion}
            title={<p className={style.accordionHeader}>Userfeed</p>}
          >
            <TextWithLabel label="Userfeed address" text={widgetSettings.recipientAddress} />
          </Accordion>
        </Paper>

      </div>
    );
  }
}
