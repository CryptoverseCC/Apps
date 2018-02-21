import { observable } from 'mobx';

export default class BlocksStore {
  @observable startBlock: number = Number.MAX_SAFE_INTEGER;
  @observable endBlock: number = Number.MAX_SAFE_INTEGER;

  constructor(startBlock: number, endBlock: number) {
    this.startBlock = startBlock;
    this.endBlock = endBlock;
  }
}
