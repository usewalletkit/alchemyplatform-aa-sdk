import {
  type Address,
  type BundlerClient,
  type SmartAccountClient,
  type SmartContractAccount,
} from "@alchemy/aa-core";
import type { Chain, Transport } from "viem";

export type EthersProviderAdapterOpts<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
> = {
  entryPointAddress?: Address;
  account?: TAccount;
} & (
  | { rpcProvider: string | BundlerClient; chainId: number }
  | { accountProvider: SmartAccountClient<TTransport, TChain, TAccount> }
);
