import type { FC } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import styled from "@emotion/styled";
import type { TChildren } from "src/t/index";
import type { ClassValue } from "clsx";
import clsx from "clsx";

const Root = styled(motion.label)``;
const Input = styled(motion.input)``;

export type TPassedNumberProps = Pick<
  TBasicNumberProps,
  "onChange"
>;

export type TBasicNumberProps = HTMLMotionProps<"input"> & {
  classValue?: ClassValue;
  inputClassValue?: ClassValue;
  name: string;
  title?: string;
  header?: TChildren;
  labelProps?: HTMLMotionProps<"label">;
};
export const Basic: FC<TBasicNumberProps> = ({
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
      "flex relative truncate",
      classValue ?? "text-white-dark text-xs w-24",
    )}
    {...(labelProps ?? {})}
  >
    <Input
      name={name}
      className={clsx("w-full p-1", inputClassValue)}
      value={value}
      type="number"
      onChange={onChange}
      {...props}
    />
    {header && (
      <div className="absolute right-1 top-0 text-purple-04 pointer-events-none">
        {header}
      </div>
    )}
  </Root>
);
