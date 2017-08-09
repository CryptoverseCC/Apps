import { createSelectorCreator } from 'reselect';
import * as memoize from 'lodash/memoize';

const hashFunction = (...args) => args.reduce((acc, val) => acc + '-' + JSON.stringify(val), '');

// ToDo optimize this?
const createSelector = createSelectorCreator(memoize, hashFunction);

import { IRootState } from '../reducers';
import { ILink } from '../types';

const whitelistedLinks = ({ links }: IRootState) => links.links;
const allLinks = ({ links }: IRootState) => links.allLinks;

export const visibleLinks = createSelector(
  whitelistedLinks,
  allLinks,
  ({ widget }: IRootState) => widget,
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
const calculateProbabilities = (links: ILink[]): ILink[] => {
  const scoreSum = links.reduce((acc, { score }) => acc + score, 0);

  let probabilities;
  if (scoreSum !== 0) {
    probabilities = links.map(({ score }) => score / scoreSum * 100);
  } else {
    probabilities = links.map(({ score }) => 1 / links.length * 100);
  }

  const roundedDownProbabilities = probabilities.map((probability) => Math.floor(probability));
  const roundedDownProbabilitiesSum = roundedDownProbabilities.reduce((acc, probability) => acc + probability, 0);

  let roundedProbabilities;
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
