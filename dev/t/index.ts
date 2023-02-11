type TBaseChildren = JSX.Element | null;
export type TChildrenElement =
  | TBaseChildren
  | TBaseChildren[];
export type TChildren = string | TChildrenElement | null;
export type TError = any | unknown;
export type TEmptyRecord = Record<string, unknown>;
export type TAnyRecord = Record<string, any>;
