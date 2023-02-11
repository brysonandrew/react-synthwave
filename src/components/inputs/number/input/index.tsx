import type { FC } from "react";
import type { HTMLMotionProps } from "framer-motion";
import type { TBasicNumberProps } from "./Basic";
import { Basic } from "./Basic";

export type TPassedNumberProps = Pick<
  TNumberProps,
  "onChange"
>;

export type TNumberProps = HTMLMotionProps<"input"> &
  TBasicNumberProps & {
    isVoiceActived?: boolean;
  };
export const Number: FC<TNumberProps> = ({
  isVoiceActived,
  ...props
}) => <Basic {...props} />;
