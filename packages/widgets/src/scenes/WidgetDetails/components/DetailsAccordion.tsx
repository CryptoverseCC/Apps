import { h, Component } from 'preact';

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

  render({ recipientAddress, size, slots, whitelistedLinksCount, allLinksCount, hasWhitelist,
    links, whitelistedLinks, allLinks }: IDetailsAccordinProps) {

    return (
      <div class={style.self}>
        <Paper>
          <Accordion
            class={style.accordion}
            title={<p class={style.accordionHeader}>Slots <Pill>{slots}</Pill></p>}
          >
            <SimpleLinksList links={links} />
          </Accordion>
        </Paper>
        <Paper>
          <Accordion
            class={style.accordion}
            title={<p class={style.accordionHeader}>Whitelist <Pill>{whitelistedLinksCount}</Pill></p>}
          >
            <SimpleLinksList links={whitelistedLinks} />
          </Accordion>
        </Paper>
        { !hasWhitelist &&
          <Paper>
            <Accordion
              class={style.accordion}
              title={<p class={style.accordionHeader}>Algorithm <Pill>{allLinksCount}</Pill></p>}
            >
              <SimpleLinksList links={allLinks} />
            </Accordion>
          </Paper>
        }
        <Paper>
          <Accordion
            open
            class={style.accordion}
            title={<p class={style.accordionHeader}>Widget Specification</p>}
          >
            <div class={style.widgetSpecification}>
              <TextWithLabel label="Size" text={size} />
              <TextWithLabel label="Type" text="Text" />
              <TextWithLabel label="Token">
                <EthereumLogo class={style.tokenLogo} /> Ether
              </TextWithLabel>
              <TextWithLabel label="Algorithm">
                Text
              </TextWithLabel>
            </div>
          </Accordion>
        </Paper>
        <Paper>
          <Accordion
            open
            class={style.accordion}
            title={<p class={style.accordionHeader}>Userfeed</p>}
          >
            <TextWithLabel label="Userfeed address" text={recipientAddress} />
          </Accordion>
        </Paper>

      </div>
    );
  }
}
