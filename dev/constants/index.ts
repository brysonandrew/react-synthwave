import clsx from "clsx";

export const ITEM_BASE_CLASS = clsx(
  "bg-500 backdrop-blur-md h-full",
);

export const ITEM_CLASS = clsx(
  ITEM_BASE_CLASS,
  "border-white border-2 border-opacity-40 rounded-md py-2 px-3",
);

export const INPUT_CLASS = clsx(
  "h-6 bg-white rounded-md bg-opacity-10",
);

export const BOX_CLASS =
  "p-1 bg-opacity-20 backdrop-blur-lg rounded-md";
export const BOX_GREEN_CLASS = "p-1";

export const INSET_BOX_INPUT_CLASS =
  "absolute inset-0 lowercase truncate w-full text-md px-2 py-0.6 disabled:brightness-50";

export const GRADIENT =
  "bg-gradient-to-r from-blue to-purple";
5;
