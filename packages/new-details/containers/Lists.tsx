import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import differenceBy from 'lodash/differenceBy';

import LinksStore from '@linkexchange/links-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { IRemoteLink, ILink } from '@linkexchange/types/link';

import { delayed } from '../utils';
import BoostLink from './BoostLink';
import { NoLinks, Loading } from '../components/Placeholders';
import { ListHeaderSlots, ListHeaderOutside, LinkRow } from '../components/List';

const DebouncedLoading = delayed(200)(Loading);

interface IProps {
  widgetSettingsStore?: IWidgetSettings;
  boostComponent?: React.ComponentType<{
    link: ILink | IRemoteLink;
    render(state: { enabled: boolean; reason?: string }): JSX.Element;
  }>;
  links?: LinksStore;
  addLink?: JSX.Element;
}

@inject('links', 'widgetSettingsStore')
@observer
export default class Lists extends Component<IProps> {
  render() {
    const { whitelist, slots } = this.props.widgetSettingsStore!;
    const { links, addLink, boostComponent } = this.props;
    const hasWhitelist = !!whitelist;
    const linksInSlots = links!.visibleLinks;
    const whitelistedLinks = differenceBy(links!.whitelistedLinks, linksInSlots, (a) => a.id);
    const allLinks = differenceBy(links!.allLinks, linksInSlots, (a) => a.id);
    const linksOutside = hasWhitelist ? whitelistedLinks : allLinks;

    return (
      <>
        {links!.fetching && <DebouncedLoading />}
        {links!.fetched && linksInSlots.length === 0 && linksOutside.length === 0 && <NoLinks addLink={addLink} />}
        {links!.fetched &&
          (linksInSlots.length > 0 || linksOutside.length > 0) && (
            <>
              <ListHeaderSlots linksCount={linksInSlots.length} slots={slots} />
              {linksInSlots.map((link, index) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  boostComponent={boostComponent || BoostLink}
                  lastChild={index === linksInSlots.length - 1}
                />
              ))}
              <ListHeaderOutside hasWhitelist={hasWhitelist} />
              {linksOutside.map((link, index) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  boostComponent={boostComponent || BoostLink}
                  lastChild={index === linksOutside.length - 1}
                />
              ))}
            </>
          )}
      </>
    );
  }
}
