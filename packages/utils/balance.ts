import { BN } from 'web3-utils';

export const fromWeiToString = (wei: string | number, decimals: string | number, decimalFigures: number = 3) => {
  const divider = new BN(10).pow(new BN(decimals));
  const div = new BN(wei).div(divider).toString();
  const mod = new BN(wei).mod(divider).toString(10).slice(0, decimalFigures);

  return `${div}.${mod}`;
};

export const toWei = (amout: string | number, decimals: string | number) => {
  const parsedDecimals = parseInt(decimals as string, 10); // ToDo check this casting
  const multiplier = new BN(10).pow(new BN(parsedDecimals));
  const [integral, rawFraction = ''] = amout.toString().split('.');
  const fraction = rawFraction.padEnd(parsedDecimals, '0').slice(0, parsedDecimals);

  return new BN(integral).mul(multiplier).add(new BN(fraction)).toString(10);
};
