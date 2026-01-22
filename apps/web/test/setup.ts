import '@testing-library/jest-dom';

const storage = {
  data: new Map<string, string>(),
  getItem(key: string) {
    return this.data.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    this.data.set(key, value);
  },
  removeItem(key: string) {
    this.data.delete(key);
  },
  clear() {
    this.data.clear();
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
});
