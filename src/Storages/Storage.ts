export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
