import type { ClassValue } from "clsx";
import clsx from "clsx";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { ITEM_CLASS } from "@constants/index";
import type {
  TSelectProps as _TSelectProps} from "./input";
import {
  Select as _Select
} from "./input";

const Root = styled(motion.div)``;

export type TSelectProps<T extends string> = Pick<
  _TSelectProps<T>,
  "name" | "value" | "onChange" | "options"
> & {
  title: string;
  classValue?: ClassValue;
  classTitleValue?: ClassValue;
  inactive?: boolean;
};
export const Select = <T extends string>({
  title,
  classValue,
  classTitleValue,
  inactive,
  ...props
}: TSelectProps<T>) => (
  <Root
    className={clsx(ITEM_CLASS, classValue, [
      inactive && "opacity-50",
    ])}
  >
    <div className="flex items-center justify-between">
      <div
        className={clsx(
          "whitespace-nowrap h-full",
          classTitleValue,
        )}
      >
        {title}
      </div>
      <div className="p-2" />
      <_Select<T>
        {...props}
        classValue={clsx(
          "grow",
        )}
      />
    </div>
  </Root>
);
