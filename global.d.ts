declare const VERSION: string;

/* tslint:disable */
interface Window {
  web3: any;
  Intercom: IItercom;
  Intl?: TIntl;
}
/* tslint:enable */

interface IItercom {
  (...args): void;
  q: any[];
  c(args: any): void;
}

declare module '*.jpg';
declare module '*.svg';
declare module '*.png';

type TIntl = any;
