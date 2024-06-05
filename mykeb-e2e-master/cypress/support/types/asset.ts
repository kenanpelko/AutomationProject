import { Alias } from "./alias";

export type Asset = {
  name?: string;
  assetType?: string;
  description?: string;
  alias?: [Alias];
  children?: [any];
};
