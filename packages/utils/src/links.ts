import { ILink, IRemoteLink } from '@linkexchange/types/link';

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

export default calculateProbabilities;
