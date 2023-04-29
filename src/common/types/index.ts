export type Pure<T> = {
  [P in keyof T]: T[P];
};

export * from "./enums";
