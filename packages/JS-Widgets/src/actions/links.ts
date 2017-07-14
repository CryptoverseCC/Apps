
import { actionCreatorFactory } from 'typescript-fsa';

import { IRootState } from '../reducers';
import { ILink } from '../types';

const acf = actionCreatorFactory('links');

export const fetchLinksActions = acf.async<
  void,
  {
    whitelistedLinks: ILink[];
    allLinks: ILink[];
  },
  { reason: any }
  >('FETCH_LINKS');

export const fetchLinks = () => async (dispatch, getState: () => IRootState) => {
  const { widget: { context, algorithm, whitelist } } = getState();
  dispatch(fetchLinksActions.started(undefined));

  const baseURL = 'https://api.userfeeds.io/ranking';
  const queryParams = whitelist ? `?whitelist=${whitelist}` : '';
  try {
    const [{ items: rawWhitelistedLinks }, { items: allLinks }]: [{ items: ILink[] }, { items: ILink[] }]  =
      await Promise.all([
        fetch(`${baseURL}/${context}/${algorithm}/${queryParams}`).then((res) => res.json()),
        fetch(`${baseURL}/${context}/${algorithm}/`).then((res) => res.json()),
      ]);

    if (rawWhitelistedLinks.length === 0) {
      return dispatch(fetchLinksActions.done({ params: undefined, result: { whitelistedLinks: [], allLinks: [] }}));
    }

    const whitelistedLinks = calculateProbabilities(rawWhitelistedLinks);

    dispatch(fetchLinksActions.done({ params: undefined, result: { whitelistedLinks, allLinks }}));
  } catch (e) {
    dispatch(fetchLinksActions.failed(e));
  }
};

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
