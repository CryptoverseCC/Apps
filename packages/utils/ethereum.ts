import { getBlockNumber, getBlock } from '@userfeeds/core/src/utils';

const DEFAULT_AVERAGE_TIME = 12;
export const getAverageBlockTime = async (web3): Promise<number> => {
  const SPAN = 1000;
  const blockNumber = await getBlockNumber(web3);
  const currentBlock = await getBlock(web3, blockNumber);
  const pastBlock = await getBlock(web3, blockNumber - SPAN);

  if (!currentBlock) {
    return DEFAULT_AVERAGE_TIME;
  }

  const average = (currentBlock.timestamp - pastBlock.timestamp) / SPAN;
  return average;
};
