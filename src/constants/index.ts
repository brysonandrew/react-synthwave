import clsx from "clsx";

export const ELEVATED =
  "bg-black-lightest-9 shadow-neu-black";

export const ITEM_BASE_CLASS = clsx(
  "bg-black-9 backdrop-blur-md shadow-neu-black",
  ELEVATED,
);

export const ITEM_CLASS = clsx(
  ITEM_BASE_CLASS,
  "py-2 px-3",
);
export const BOX_CLASS =
  "p-1 bg-black bg-opacity-20 backdrop-blur-lg shadow-purple-sm rounded-md";
export const BOX_GREEN_CLASS =
  "p-1 bg-green shadow-green-02-sm";

export const BOX_GREEN_INPUT_CLASS =
  "relative shadow-green-04-sm text-green active:shadow-green-sm hover:shadow-green-sm";

export const BOX_BLUE_INPUT_CLASS =
  "relative shadow-blue-light-04-sm text-blue-light active:shadow-blue-light-sm hover:shadow-blue-light-sm";

export const INSET_BOX_INPUT_CLASS =
  "absolute inset-0 lowercase truncate w-full text-md px-2 py-1 disabled:brightness-50";

export const GRADIENT =
  "bg-gradient-to-r from-blue to-purple";
