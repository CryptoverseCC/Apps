export default class Erc20Cache {
  constructor(private token: string) {}
  get symbol() {
    return sessionStorage.getItem(`${this.token}.symbol`);
  }
  set symbol(symbol) {
    sessionStorage.setItem(`${this.token}.symbol`, symbol);
  }
  get decimals() {
    return sessionStorage.getItem(`${this.token}.decimals`);
  }
  set decimals(decimals) {
    sessionStorage.setItem(`${this.token}.symbol`, decimals);
  }
  get name() {
    return sessionStorage.getItem(`${this.token}.name`);
  }
  set name(name) {
    sessionStorage.setItem(`${this.token}.name`, name);
  }
}
