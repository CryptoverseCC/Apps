import { createSelectorCreator } from 'reselect';
import * as memoize from 'lodash/memoize';

import { ILink, IRemoteLink } from '@userfeeds/types/link';

import { ILinksState, IWidgetState } from '../ducks';

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

export const whitelistedLinksCount = createSelector(
  whitelistedLinks,
  (links) => links.length,
);

export const allLinksCount = createSelector(
  allLinks,
  (links) => links.length,
);

// ToDo rething function name
const calculateProbabilities = (links: IRemoteLink[]): ILink[] => {

  const scoreSum = links.reduce((acc, { score }) => acc + score, 0);

  let probabilities: number[];
  if (scoreSum !== 0) {
    probabilities = links.map(({ score }) => score / scoreSum * 100);
  } else {
    probabilities = links.map(({ score }) => 1 / links.length * 100);
  }

  const roundedDownProbabilities = probabilities.map((probability) => Math.floor(probability));
  const roundedDownProbabilitiesSum = roundedDownProbabilities.reduce((acc, probability) => acc + probability, 0);

  let roundedProbabilities: number[];
  if (roundedDownProbabilitiesSum === 100) {
    roundedProbabilities = roundedDownProbabilities;
  } else {
    const toDistribute = 100 - roundedDownProbabilitiesSum;
    const toRoundUp = roundedDownProbabilities
      .map((p, i) => ([probabilities[i] - p, i]))
      .sort(([p1], [p2]) => p2 - p1)
      .slice(0, toDistribute)
      .reduce((acc: { [key: number]: boolean }, [_, i]) => {
        acc[i] = true;
        return acc;
      }, []);

    roundedProbabilities = roundedDownProbabilities
      .map((probability, index) => toRoundUp[index] ? probability + 1 : probability);
  }

  return links.map((link, i) => ({ probability: roundedProbabilities[i], ...link }));
};
