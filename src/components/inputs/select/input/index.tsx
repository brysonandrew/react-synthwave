import type { ChangeEvent } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { CaretDown } from "@components/icons/CaretDown";
import { css } from "@emotion/react";
import {
  INPUT_CLASS,
  INSET_BOX_INPUT_CLASS,
} from "@constants/index";

const parseOptions = <T extends string>(
  option: T | [T, string],
): [T, string] => {
  if (Array.isArray(option) && option.length === 2) {
    return option;
  } else {
    return [option, option];
  }
};

export const clearNativeCss = css`
  background-color: transparent;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  outline-color: #666 !important;
`;

const Root = styled(motion.div)``;
const _Select = styled(motion.select)`
  ${clearNativeCss}
`;
const Option = styled(motion.option)``;
const Icon = styled.div``;

export type TSelectProps<T> = HTMLMotionProps<"select"> & {
  name: string;
  title?: string;
  header?: string;
  classValue?: ClassValue;
  inputClassValue?: ClassValue;
  options: readonly T[] | T[] | [T, string][];
  value?: string;
  onChange(event: ChangeEvent<HTMLSelectElement>): void;
};
export const Select = <T extends string>({
  name,
  title,
  header,
  options,
  value,
  classValue,
  inputClassValue,
  onChange,
  ...props
}: TSelectProps<T>) => (
  <Root
    className={clsx(
      INPUT_CLASS,
      "relative w-full",
      classValue,
    )}
    title={title}
  >
    <_Select
      className={clsx(
        INSET_BOX_INPUT_CLASS,
        inputClassValue,
      )}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    >
      {options
        .map(parseOptions)
        .map(([value, name]: [string, string]) => (
          <Option
            key={value}
            value={value}
            className="text-left"
          >
            {name}
          </Option>
        ))}
    </_Select>
    <Icon className="absolute top-1/2 -translate-y-1/2 right-1.5 pointer-events-none">
      <CaretDown />
    </Icon>
    {header && (
      <div className="absolute right-1 top-0 pointer-events-none">
        {header}
      </div>
    )}
  </Root>
);
