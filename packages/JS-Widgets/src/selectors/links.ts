import { createSelector } from 'reselect';

import { IRootState } from '../reducers';
import { ILink } from '../types';

const whitelistedLinks = ({ links }: IRootState) => links.links;
const allLinks = ({ links }: IRootState) => links.allLinks;

export const visibleLinks = createSelector(
  whitelistedLinks,
  ({ widget }: IRootState) => widget.slots,
  (links, slots) => calculateProbabilities(links.slice(0, slots)),
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
  const probabilities = links.map(({ score }) => score / scoreSum * 100);
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
