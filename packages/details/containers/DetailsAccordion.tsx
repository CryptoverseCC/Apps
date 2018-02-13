import { connect } from 'react-redux';
import differenceBy from 'lodash/differenceBy';

import { WidgetSettings } from '@linkexchange/widget-settings';

import LinksStore from '../linksStore';
// import { visibleLinks } from '../selectors/links';

import DetailsAccordionComponent from '../components/DetailsAccordion';

// const mapStateToProps = (state: { links: LinksStore; widget: WidgetSettings }, props) => {
//   const { links, widget } = state;
//   const linksInSlots = visibleLinks(state);
//   const whitelistedLinks = differenceBy(links.links, linksInSlots, (a) => a.id);
//   const allLinks = differenceBy(links.allLinks, linksInSlots, (a) => a.id);

//   return {
//     hasWhitelist: !!widget.whitelist,
//     widgetSettings: widget,
//     links: linksInSlots,
//     whitelistedLinks,
//     allLinks,
//     allLinksCount: links.allLinks.length,
//     whitelistedLinksCount: whitelistedLinks.length,
//   };
// };

// const DetailsAccordion = connect(mapStateToProps)(DetailsAccordionComponent);

export default DetailsAccordionComponent;
