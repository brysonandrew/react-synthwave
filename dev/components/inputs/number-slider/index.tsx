import type { FC } from "react";
import { Number as _Number } from "../number/input";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import type { TSliderProps } from "../slider/input";
import { Slider } from "../slider/input";
import type { TNumberProps } from "../number/input";
import { INPUT_CLASS, ITEM_CLASS } from "@constants/index";

export type TNumberSliderProps = Pick<
  TNumberProps & TSliderProps,
  | "disabled"
  | "min"
  | "max"
  | "step"
  | "name"
  | "value"
  | "onChange"
> & {
  classValue?: ClassValue;
  classTitleValue?: ClassValue;
  title: string;
  inactive?: boolean;
};
export const NumberSlider: FC<TNumberSliderProps> = ({
  classValue,
  classTitleValue,
  title,
  inactive,
  ...props
}) => (
  <div
    className={clsx(ITEM_CLASS, classValue, [
      inactive && "opacity-50",
    ])}
  >
    <div className="flex items-center">
      <div
        className={clsx(
          "whitespace-nowrap",
          classTitleValue,
        )}
      >
        {title}
      </div>
      <div className="p-2" />
      <_Number classValue="text-md" {...props} />
      <div className="p-2" />
      <div
        className={clsx(
          "flex relative w-full z-0",
          INPUT_CLASS
        )}
      >
        <Slider {...props} />
      </div>
    </div>
  </div>
);
