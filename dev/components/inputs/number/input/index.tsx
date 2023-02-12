import type { FC } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import styled from "@emotion/styled";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { INPUT_CLASS } from "@constants/index";
import type { TChildren } from "t";

const Root = styled(motion.label)``;
const Input = styled(motion.input)``;

export type TPassedNumberProps = Pick<
  TNumberProps,
  "onChange"
>;

export type TNumberProps = HTMLMotionProps<"input"> & {
  classValue?: ClassValue;
  inputClassValue?: ClassValue;
  name: string;
  title?: string;
  header?: TChildren;
  labelProps?: HTMLMotionProps<"label">;
};
export const Number: FC<TNumberProps> = ({
  name,
  value,
  title,
  header,
  classValue,
  inputClassValue,
  labelProps,
  onChange,
  ...props
}) => (
  <Root
    {...(title ? { title } : {})}
    className={clsx(
      INPUT_CLASS,
      "flex relative truncate",
      classValue ?? "text-xs w-24",
    )}
    {...(labelProps ?? {})}
  >
    <Input
      name={name}
      className={clsx("w-full py-1 px-2", inputClassValue)}
      value={value}
      type="number"
      onChange={onChange}
      {...props}
    />
    {header && (
      <div className="absolute right-1 top-0 pointer-events-none">
        {header}
      </div>
    )}
  </Root>
);
