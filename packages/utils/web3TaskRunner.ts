import Web3 from 'web3';

type TTask<T, Args> = (web3: Web3, args: Args, listener: TListener<T>) => any;
type TListener<T> = (result: T) => void;

export default class Web3TaskRunner<T, Args> {

  mapping: Map<Web3, Map<string, Array<TListener<T>>>> = new Map();

  constructor(private task: TTask<T, Args>) {}

  run(web3: Web3, args: Args, listener: TListener<T>) {
    if (!this.mapping.has(web3)) {
      const argsToListeners = new Map();
      this.mapping.set(web3, argsToListeners);
    }

    const argsString = args instanceof Array ? args.reduce<string>((acc, arg) => acc + arg, '') : '';
    let listeners;
    if (!this.mapping.get(web3)!.has(argsString)) {
      listeners = [listener];
      this.mapping.get(web3)!.set(argsString, listeners);

      this._execute(web3, args, listeners);
    } else {
      listeners = this.mapping.get(web3)!.get(argsString);
      listeners.push(listener);
    }

    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  _execute(web3: Web3, args: Args, listeners: Array<TListener<T>>) {
    this.task(web3, args, (result) => {
      listeners.forEach((l) => l(result));
    });
  }
}
