import {
  custom,
  type Chain,
  type Client,
  type ClientConfig,
  type CustomTransport,
  type FormattedTransactionRequest,
  type PublicActions,
  type PublicRpcSchema,
  type RpcSchema,
  type Transport,
} from "viem";
import { z } from "zod";
import type { SmartContractAccount } from "../account/smartContractAccount.js";
import { AccountNotFoundError } from "../errors/account.js";
import { ChainNotFoundError } from "../errors/client.js";
import { middlewareActions } from "../middleware/actions.js";
import type { ClientMiddleware } from "../middleware/types.js";
import type { Prettify } from "../utils/index.js";
import { createBundlerClient, type BundlerClient } from "./bundlerClient.js";
import {
  type BundlerActions,
  type BundlerRpcSchema,
} from "./decorators/bundlerClient.js";
import {
  smartAccountClientActions,
  type BaseSmartAccountClientActions,
} from "./decorators/smartAccountClient.js";
import { SmartAccountClientOptsSchema } from "./schema.js";
import type { ClientMiddlewareConfig } from "./types.js";

type SmartAccountClientOpts = z.output<typeof SmartAccountClientOptsSchema>;

export type SmartAccountClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
> = Prettify<
  Pick<
    ClientConfig<transport, chain, account>,
    | "cacheTime"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "transport"
    | "type"
  > & {
    account?: account;
    opts?: z.input<typeof SmartAccountClientOptsSchema>;
  } & ClientMiddlewareConfig
>;

export type SmartAccountClientRpcSchema = [
  ...BundlerRpcSchema,
  ...PublicRpcSchema
];

export type SmartAccountClientActions<
  chain extends Chain | undefined = Chain | undefined,
  account extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
> = BaseSmartAccountClientActions<chain, account> &
  BundlerActions &
  PublicActions;

export type SmartAccountClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined,
  actions extends SmartAccountClientActions<
    chain,
    account
  > = SmartAccountClientActions<chain, account>,
  rpcSchema extends RpcSchema = SmartAccountClientRpcSchema
> = Prettify<Client<transport, chain, account, rpcSchema, actions>>;

export type BaseSmartAccountClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
> = Prettify<
  Client<
    transport,
    chain,
    account,
    [...BundlerRpcSchema, ...PublicRpcSchema],
    { middleware: ClientMiddleware } & SmartAccountClientOpts &
      BundlerActions &
      PublicActions
  >
>;

export function createSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
>(
  config: SmartAccountClientConfig<TTransport, TChain, TAccount>
): SmartAccountClient<TTransport, TChain, TAccount>;

export function createSmartAccountClient(
  config: SmartAccountClientConfig
): SmartAccountClient {
  const {
    key = "account",
    name = "account provider",
    transport,
    type = "SmartAccountClient",
    ...params
  } = config;

  const client: SmartAccountClient = createBundlerClient({
    ...params,
    key,
    name,
    // we start out with this because the base methods for a SmartAccountClient
    // require a smart account client, but once we've completed building everything
    // we want to override this value with the one passed in by the extender
    type: "SmartAccountClient",
    // TODO: this needs to be tested
    transport: (opts) => {
      const rpcTransport = transport(opts);

      return custom({
        async request({ method, params }) {
          switch (method) {
            case "eth_sendTransaction":
              if (!client.account) {
                throw new AccountNotFoundError();
              }
              if (!client.chain) {
                throw new ChainNotFoundError();
              }
              const [tx] = params as [FormattedTransactionRequest];
              return client.sendTransaction({
                ...tx,
                account: client.account,
                chain: client.chain,
              });
            case "eth_sign":
              if (!client.account) {
                throw new AccountNotFoundError();
              }
              const [address, data] = params!;
              if (address !== client.account.address) {
                throw new Error(
                  "cannot sign for address that is not the current account"
                );
              }
              return client.signMessage(data);
            case "personal_sign": {
              if (!client.account) {
                throw new AccountNotFoundError();
              }
              const [data, address] = params!;
              if (address !== client.account.address) {
                throw new Error(
                  "cannot sign for address that is not the current account"
                );
              }
              return client.signMessage(data);
            }
            case "eth_signTypedData_v4": {
              if (!client.account) {
                throw new AccountNotFoundError();
              }
              const [address, dataParams] = params!;
              if (address !== client.account.address) {
                throw new Error(
                  "cannot sign for address that is not the current account"
                );
              }
              return client.signTypedData(dataParams);
            }
            case "eth_chainId":
              if (!opts.chain) {
                throw new ChainNotFoundError();
              }

              return opts.chain.id;
            default:
              // TODO: there's probably a number of methods we just don't support, will need to test most of them out
              // first let's get something working though
              return rpcTransport.request({ method, params });
          }
        },
      })(opts);
    },
  })
    .extend(() => ({
      ...SmartAccountClientOptsSchema.parse(config.opts ?? {}),
    }))
    .extend(middlewareActions(config))
    .extend(smartAccountClientActions);

  return { ...client, type };
}

export function createSmartAccountClientFromExisting<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined,
  TClient extends BundlerClient<TTransport> = BundlerClient<TTransport>,
  TActions extends SmartAccountClientActions<
    TChain,
    TAccount
  > = SmartAccountClientActions<TChain, TAccount>,
  TRpcSchema extends SmartAccountClientRpcSchema = SmartAccountClientRpcSchema
>(
  config: Omit<
    SmartAccountClientConfig<Transport, TChain, TAccount>,
    "transport" | "chain"
  > & { client: TClient }
): SmartAccountClient<CustomTransport, TChain, TAccount, TActions, TRpcSchema>;

export function createSmartAccountClientFromExisting(
  config: Omit<SmartAccountClientConfig, "transport" | "chain"> & {
    client: BundlerClient;
  }
): SmartAccountClient {
  return createSmartAccountClient({
    ...config,
    chain: config.client.chain,
    transport: custom(config.client),
  });
}
