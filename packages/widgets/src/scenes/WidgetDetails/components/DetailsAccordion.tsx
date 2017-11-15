import React, { Component } from 'react';

import Pill from '@linkexchange/components/src/Pill';
import Paper from '@linkexchange/components/src/Paper';
import Accordion from '@linkexchange/components/src/Accordion';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';
import { ILink, IRemoteLink } from '@userfeeds/types/link';

import { EWidgetSize } from '../../../types';

import TokenLogo from '../../../components/TokenLogo';
import TokenName from '../../../components/TokenName';

import SimpleLinksList from './SimpleLinksList';
import UserfeedsAddressInfo from './UserfeedsAddressInfo';

import * as style from './detailsAccordion.scss';

interface IDetailsAccordinProps {
  recipientAddress: string;
  size: EWidgetSize;
  asset: string;
  slots: number;
  whitelistedLinksCount: number;
  allLinksCount: number;
  hasWhitelist: boolean;
  links: ILink[];
  whitelistedLinks: IRemoteLink[];
  allLinks: IRemoteLink[];
}

export default class DetailsAccordion extends Component<IDetailsAccordinProps, {}> {

  render() {
    const { recipientAddress, size, asset, slots, whitelistedLinksCount, allLinksCount, hasWhitelist,
      links, whitelistedLinks, allLinks } = this.props;

    return (
      <div className={style.self}>
        <Paper>
          <Accordion
            className={style.accordion}
            title={<p className={style.accordionHeader}>Slots <Pill>{slots}</Pill></p>}
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
              <TextWithLabel label="Size" text={size} />
              <TextWithLabel label="Type" text="Text" />
              <TextWithLabel label="Token">
                <TokenLogo className={style.tokenLogo} asset={asset} />
                <TokenName asset={asset} />
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
            <TextWithLabel label="Userfeed address" text={recipientAddress} />
          </Accordion>
        </Paper>

      </div>
    );
  }
}
