import { createSelectorCreator } from 'reselect';
import * as memoize from 'lodash/memoize';

import { ILink, IRemoteLink } from '@linkexchange/types/link';
import { IWidgetState } from '@linkexchange/ducks/widget';
import calculateProbabilities from '@linkexchange/utils/links';

import { ILinksState } from '../duck';

interface IState {
  links: ILinksState;
  widget: IWidgetState;
}

const hashFunction = (...args) => args.reduce((acc, val) => acc + '-' + JSON.stringify(val), '');

// ToDo optimize this?
const createSelector = createSelectorCreator(memoize, hashFunction);

const whitelistedLinks = ({ links }: IState) => links.links;
const allLinks = ({ links }: IState) => links.allLinks;

export const visibleLinks = createSelector(
  whitelistedLinks,
  allLinks,
  ({ widget }: IState) => widget,
  (whitelistedLinks, allLinks, widget) => {
    if (widget.whitelist !== '') {
      return calculateProbabilities(whitelistedLinks.slice(0, widget.slots));
    }

    return calculateProbabilities(allLinks.slice(0, widget.slots));
  },
);
