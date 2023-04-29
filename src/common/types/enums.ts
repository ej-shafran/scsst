import { Pure } from ".";

type _EnumFrom<TKeys extends string[]> = TKeys extends [
  infer Head extends string,
  ...infer Tail extends string[]
]
  ? Record<Head, Head> & _EnumFrom<Tail>
  : unknown;

export type EnumFrom<TKeys extends string[]> = Pure<_EnumFrom<TKeys>>;

export type EnumType<TEnum extends Record<string, any>> = TEnum[keyof TEnum];
