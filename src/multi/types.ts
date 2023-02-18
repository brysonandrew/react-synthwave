import type { TSynthOptions } from "src/single/types";

export type TMultiOptions = TSynthOptions & {
  spread?: number;
  count?: number;
  stagger?: number;
};
