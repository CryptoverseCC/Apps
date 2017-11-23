import { connect } from 'react-redux';

import { IWidgetState } from '@linkexchange/ducks/widget';

import { ILinksState } from '../duck';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../selectors/links';

import DetailsListsComponent from '../components/DetailsLists';
import DetailsAccordionComponent from '../components/DetailsAccordion';

const mapStateToProps = (state: { links: ILinksState, widget: IWidgetState }, props) => {
  const { links, widget } = state;

  return {
    ...widget,
    links: visibleLinks(state),
    whitelistedLinks: state.links.links,
    allLinks: links.allLinks,
    allLinksCount: allLinksCount(state),
    whitelistedLinksCount: whitelistedLinksCount(state),
  };
};

const DetailsLists = connect(mapStateToProps, null, null, { withRef: true })(DetailsListsComponent);
const DetailsAccordion = connect(mapStateToProps)(DetailsAccordionComponent);

export {
  DetailsLists,
  DetailsAccordion,
};
