import type { FC } from "react";
import type { TNumberProps} from "@components/inputs/number/input";
import { Number as _Number } from "@components/inputs/number/input";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { ITEM_CLASS } from "@constants/index";

export type TProps = Pick<
  TNumberProps,
  | "disabled"
  | "min"
  | "max"
  | "step"
  | "name"
  | "value"
  | "onChange"
> & {
  classValue?: ClassValue;
  title: string;
};
export const Number: FC<TProps> = ({
  classValue,
  title,
  ...props
}) => (
  <div className={clsx(ITEM_CLASS)}>
    <div className="flex items-center justify-between pl-1">
      <div
        className={clsx("whitespace-nowrap", classValue)}
      >
        {title}
      </div>
      <div className="p-2" />
      <_Number
        classValue="text-md shadow-pink"
        {...props}
      />
    </div> 
  </div>
);
