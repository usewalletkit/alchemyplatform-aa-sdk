import {
  AccountNotFoundError,
  type GetAccountParameter,
  type SendUserOperationResult,
  type SmartContractAccount,
  type UserOperationOverrides,
} from "@alchemy/aa-core";
import type { Address, Chain, Client, Hex, Transport } from "viem";
import {
  SessionKeyPlugin,
  sessionKeyPluginActions as sessionKeyPluginActions_,
  type SessionKeyPluginActions as SessionKeyPluginActions_,
} from "./plugin.js";
import { buildSessionKeysToRemoveStruct } from "./utils.js";

export type SessionKeyPluginActions<
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
> = Omit<
  SessionKeyPluginActions_<TAccount>,
  | "removeSessionKey"
  | "addSessionKey"
  | "rotateSessionKey"
  | "updateKeyPermissions"
> & {
  isAccountSessionKey: (
    args: {
      key: Address;
      pluginAddress?: Address;
    } & GetAccountParameter<TAccount>
  ) => Promise<boolean>;

  getAccountSessionKeys: (
    args: {
      pluginAddress?: Address;
    } & GetAccountParameter<TAccount>
  ) => Promise<ReadonlyArray<Address>>;

  removeSessionKey: (
    args: {
      key: Address;
      pluginAddress?: Address;
      overrides?: UserOperationOverrides;
    } & GetAccountParameter<TAccount>
  ) => Promise<SendUserOperationResult>;

  addSessionKey: (
    args: {
      key: Address;
      permissions: Hex[];
      tag: Hex;
      overrides?: UserOperationOverrides;
    } & GetAccountParameter<TAccount>
  ) => Promise<SendUserOperationResult>;

  rotateSessionKey: (
    args: {
      oldKey: Address;
      newKey: Address;
      pluginAddress?: Address;
      overrides?: UserOperationOverrides;
    } & GetAccountParameter<TAccount>
  ) => Promise<SendUserOperationResult>;

  updateSessionKeyPermissions: (
    args: {
      key: Address;
      permissions: Hex[];
      overrides?: UserOperationOverrides;
    } & GetAccountParameter<TAccount>
  ) => Promise<SendUserOperationResult>;
};

export const sessionKeyPluginActions: <
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
>(
  client: Client<TTransport, TChain, TAccount>
) => SessionKeyPluginActions<TAccount> = <
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined
>(
  client: Client<TTransport, TChain, TAccount>
) => {
  const {
    removeSessionKey,
    addSessionKey,
    rotateSessionKey,
    updateKeyPermissions,
    ...og
  } = sessionKeyPluginActions_(client);

  return {
    ...og,
    isAccountSessionKey: async ({
      key,
      pluginAddress,
      account = client.account,
    }) => {
      if (!account) throw new AccountNotFoundError();

      const contract = SessionKeyPlugin.getContract(client, pluginAddress);

      return await contract.read.isSessionKeyOf([account.address, key]);
    },

    getAccountSessionKeys: async ({
      pluginAddress,
      account = client.account,
    }) => {
      if (!account) throw new AccountNotFoundError();

      const contract = SessionKeyPlugin.getContract(client, pluginAddress);

      return await contract.read.sessionKeysOf([account.address]);
    },

    removeSessionKey: async ({
      key,
      overrides,
      account = client.account,
      pluginAddress,
    }) => {
      if (!account) throw new AccountNotFoundError();

      const sessionKeysToRemove = await buildSessionKeysToRemoveStruct(client, {
        keys: [key],
        account,
        pluginAddress,
      });

      return removeSessionKey({
        args: [key, sessionKeysToRemove[0].predecessor],
        overrides,
        account,
      });
    },

    addSessionKey: async ({
      key,
      tag,
      permissions,
      overrides,
      account = client.account,
    }) => {
      if (!account) throw new AccountNotFoundError();

      return addSessionKey({
        args: [key, tag, permissions],
        overrides,
        account,
      });
    },

    rotateSessionKey: async ({
      newKey,
      oldKey,
      overrides,
      pluginAddress,
      account = client.account,
    }) => {
      if (!account) throw new AccountNotFoundError();

      const contract = SessionKeyPlugin.getContract(client, pluginAddress);

      const predecessor = await contract.read.findPredecessor([
        account.address,
        oldKey,
      ]);

      return rotateSessionKey({
        args: [oldKey, predecessor, newKey],
        overrides,
        account,
      });
    },

    updateSessionKeyPermissions: async ({
      key,
      permissions,
      overrides,
      account = client.account,
    }) => {
      if (!account) throw new AccountNotFoundError();

      return updateKeyPermissions({
        args: [key, permissions],
        overrides,
        account,
      });
    },
  };
};
