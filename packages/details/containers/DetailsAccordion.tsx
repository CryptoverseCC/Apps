import { connect } from 'react-redux';

import { IWidgetState } from '@linkexchange/ducks/widget';

import { ILinksState } from '../duck';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../selectors/links';

import DetailsAccordionComponent from '../components/DetailsAccordion';

const mapStateToProps = (state: { links: ILinksState, widget: IWidgetState }, props) => {
  const { links, widget } = state;

  return {
    hasWhitelist: !!widget.whitelist,
    widgetSettings: widget,
    links: visibleLinks(state),
    whitelistedLinks: state.links.links,
    allLinks: links.allLinks,
    allLinksCount: allLinksCount(state),
    whitelistedLinksCount: whitelistedLinksCount(state),
  };
};

const DetailsAccordion = connect(mapStateToProps)(DetailsAccordionComponent);

export default DetailsAccordion;
