import Storage from './Storage';

export default class LocalStorage implements Storage {
  getItem(key: string) {
    return new Promise<string | null>(res => {
      res(window.localStorage.getItem(key));
    });
  }

  setItem(key: string, value: string) {
    return new Promise<void>(res => {
      window.localStorage.setItem(key, value);
      res();
    });
  }
}
