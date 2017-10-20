declare const VERSION: string;

interface Window {
  web3: any;
  Intercom: IItercom;
}

interface IItercom {
  (...args): void;
  q: any[];
  c(args: any): void;
}

declare module '*.png';