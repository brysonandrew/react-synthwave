import type { FC } from "react";
import type { HTMLMotionProps } from "framer-motion";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { ITEM_CLASS } from "@constants/index";
import { Slider as _Slider } from "./input";

export type TSliderProps = HTMLMotionProps<"input"> & {
  name: string;
  value: number;
  title: string;
  classValue?: ClassValue;
  headerClassValue?: ClassValue;
  resolveValueDisplay?(v: number): string;
  children?: JSX.Element | null;
};
export const Slider: FC<TSliderProps> = ({
  name,
  title,
  value,
  resolveValueDisplay,
  classValue,
  headerClassValue,
  children,
  ...props
}) => (
  <div className={clsx(ITEM_CLASS, classValue)}>
    {children}
    <div
      className={clsx(
        "flex items-center justify-between",
        headerClassValue,
      )}
    >
      <div>{title}</div>
      <div>
        {resolveValueDisplay
          ? resolveValueDisplay(value)
          : value}
      </div>
    </div>
    <div className="p-1" />
    <div
      className={clsx(
        "flex relative shadow-purple",
      )}
    >
      <_Slider name={name} value={value} {...props} />
    </div>
  </div>
);
