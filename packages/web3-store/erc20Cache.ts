export default class Erc20Cache {
  constructor(private network: string, private token: string) {}
  get symbol() {
    return sessionStorage.getItem(`${this.network}:${this.token}.symbol`);
  }
  set symbol(symbol) {
    sessionStorage.setItem(`${this.network}:${this.token}.symbol`, symbol!);
  }
  get decimals() {
    return sessionStorage.getItem(`${this.network}:${this.token}.decimals`);
  }
  set decimals(decimals) {
    sessionStorage.setItem(`${this.network}:${this.token}.decimals`, decimals!);
  }
  get name() {
    return sessionStorage.getItem(`${this.network}:${this.token}.name`);
  }
  set name(name) {
    sessionStorage.setItem(`${this.network}:${this.token}.name`, name!);
  }
}
