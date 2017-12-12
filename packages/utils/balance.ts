import { BN } from 'web3-utils';

export const fromWeiToString = (wei: string | number, decimals: string | number, decimalFigures: number = 3) => {
  const counter = new BN(typeof wei === 'number' ? '' + wei : wei, 10);
  const divider = new BN(10).pow(new BN(decimals));
  const div = new BN(counter).div(divider).toString();
  const mod = new BN(counter).mod(divider).toString(10, decimals).slice(0, decimalFigures);

  return `${div}.${mod}`;
};

export const toWei = (amout: string | number, decimals: string | number) => {
  const parsedDecimals = typeof decimals !== 'number'
    ? parseInt(decimals, 10) // ToDo check this casting
    : decimals;
  const multiplier = new BN(10).pow(new BN(parsedDecimals));
  const [integral, rawFraction = ''] = amout.toString().split('.');
  const fraction = rawFraction.padEnd(parsedDecimals, '0').slice(0, parsedDecimals);

  return new BN(integral).mul(multiplier).add(new BN(fraction)).toString(10);
};
