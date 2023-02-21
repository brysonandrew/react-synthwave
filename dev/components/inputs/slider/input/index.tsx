import type { FC, LabelHTMLAttributes } from "react";
import type {
  HTMLMotionProps,
  MotionProps,
} from "framer-motion";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { Root, Input } from "./styles";

export type TSliderProps = Omit<
  HTMLMotionProps<"input">,
  "children"
> & {
  classValue?: ClassValue;
  labelClassValue?: ClassValue;
  labelProps?: MotionProps &
    LabelHTMLAttributes<HTMLLabelElement>;
  children?: any;
};
export const Slider: FC<TSliderProps> = ({
  classValue,
  children,
  name,
  value,
  onChange,
  labelProps,
  labelClassValue,
  ...props
}) => (
  <Root
    className={clsx(
      "relative h-full w-full z-0",
      labelClassValue,
    )}
    {...(labelProps || {})}
  >
    <Input
      name={name}
      type="range"
      className={clsx(
        "absolute inset-0 disabled:brightness-50",
        classValue,
      )}
      value={value ?? ""}
      onChange={onChange}
      {...props}
    />
    {children}
  </Root>
);
