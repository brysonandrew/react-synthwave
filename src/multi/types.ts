import type { TSynthOptions } from "..";

export type TMultiOptions = TSynthOptions & {
  spread?: number;
  count?: number;
  stagger?: number;
};
