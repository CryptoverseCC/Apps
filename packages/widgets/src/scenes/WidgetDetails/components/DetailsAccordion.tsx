import React, { Component } from 'react';

import Pill from '@userfeeds/apps-components/src/Pill';
import Paper from '@userfeeds/apps-components/src/Paper';
import Accordion from '@userfeeds/apps-components/src/Accordion';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { ILink, TWidgetSize } from '../../../types';

import EthereumLogo from '../../../components/EthereumLogo';

import SimpleLinksList from './SimpleLinksList';
import UserfeedsAddressInfo from './UserfeedsAddressInfo';

import * as style from './detailsAccordion.scss';

interface IDetailsAccordinProps {
  recipientAddress: string;
  size: TWidgetSize;
  slots: number;
  whitelistedLinksCount: number;
  allLinksCount: number;
  hasWhitelist: boolean;
  links: ILink[];
  whitelistedLinks: ILink[];
  allLinks: ILink[];
}

export default class DetailsAccordion extends Component<IDetailsAccordinProps, {}> {

  render() {
    const { recipientAddress, size, slots, whitelistedLinksCount, allLinksCount, hasWhitelist,
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
                <EthereumLogo className={style.tokenLogo} /> Ether
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
