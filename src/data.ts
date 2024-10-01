export default class Data {
  static #singleton: Data;
  value: undefined | string;

  public static get singleton() {
    Data.#singleton ??= new Data();
    return Data.#singleton;
  }

  async fetch() {
    // if (!this._loadComponents) return;

    this.value = await new Promise<string>((resolve) => {
      console.log({ FETCHING: true });
      setTimeout(() => {
        resolve("foo");
      }, 1000);
    });
  }
}
