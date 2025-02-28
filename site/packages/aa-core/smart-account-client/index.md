---
outline: deep
head:
  - - meta
    - property: og:title
      content: SmartAccountClient
  - - meta
    - name: description
      content: Introduction to SmartAccountClient exported by aa-core provider
  - - meta
    - property: og:description
      content: Introduction to SmartAccountClient exported by aa-core provider
---

# Smart Account Client

The `SmartAccountClient` is an [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compliant Provider that wraps JSON RPC methods and some Wallet Methods (signing, sendTransaction, etc). With this Client, you can submit User Operations to RPC providers, estimate gas, configure a Paymaster, send standard JSON RPC requests, and more. It is not opinionated about which RPC provider you are using and is configurable to work with any RPC provider. Because it implements EIP-1193, it can be used with any web3 library.

The `SmartAccountClient` is also an extension of the `viem` [`Client`](https://viem.sh/docs/clients/custom) class.

## Import

```ts
import { createSmartAccountClient } from "@alchemy/aa-core";
// OR
import { createSmartAccountClientFromExisting } from "@alchemy/aa-core";
```

## Usage

Initialize a `SmartAcountClient` with your desired Chain and Transport using `createSmartAccountClient`, or use `createSmartAccountClientFromExisting` if you already have a [`BundlerClient`](/packages/aa-core/bundler-client/index) available
::: code-group

```ts [createSmartAccountClient.ts]
import { createSmartAccountClient } from "@alchemy/aa-core";
import { createLightAccount } from "@alchemy/aa-accounts";
import { http } from "viem";
import { sepolia } from "@alchemy/aa-core";

export const smartAccountClient = new createSmartAccountClient({
  transport: http("ALCHEMY_RPC_URL"),
  chain: sepolia,
  // optionally provide an account to use as context
  account: await createLightAccount(lightAccountParams),
});

const result = await smartAccountClient.sendUserOperation({
  uo: { target: "0xaddress", data: "0x", value: 0n },
  // if you didn't pass in an account above then:
  account: await createLightAccount(lightAccountParams),
});
```

```ts [createSmartAccountClientFromExisting.ts]
import {
  createBundlerClient,
  createSmartAccountClientFromExisting,
} from "@alchemy/aa-core";
import { http } from "viem";
import { sepolia } from "@alchemy/aa-core";

// This client only has methods for directly interacting with public RPC endpoints
const bundlerClient = createBundlerClient({
  transport: http("ALCHEMY_RPC_URL"),
  chain: sepolia,
});

const smartAccountClient = createSmartAccountClientFromExisting({
  client: bundlerClient,
  // optionally provide an account to use as context
  account: await createLightAccount(lightAccountParams),
});

const result = await smartAccountClient.sendUserOperation({
  uo: { target: "0xaddress", data: "0x", value: 0n },
  // if you didn't pass in an account above then:
  account: await createLightAccount(lightAccountParams),
});
```

:::

## Returns

### `SmartAccountClient`

A new instance of a `SmartAccountClient`.

## Parameters

### `config: SmartAccountClientConfig`

#### If using `createSmartAccountClient`:

- `transport: Transport` -- a viem [Transport](https://viem.sh/docs/clients/intro#transports) that defines how you want to interact with a JSON-RPC provider.

- `chain: Chain` -- the chain on which to create the provider.

#### If using `createSmartAccountClientFromExisting`:

- `client: BundlerClient` -- a [bundler client](/packages/aa-core/bundler-client/index) instance that will be used to communicate with an RPC provider that supports Ethereum RPC methods.

#### Common to both:

- `account?: SmartContractAccount` -- [optional] the smart account to use as context for all of your calls. If not provided, then the account can be provided to each individual call instead.

- `entryPointAddress: Address | undefined` -- [optional] the entry point contract address. If not provided, the entry point contract address for the provider is the connected account's entry point contract, or if not connected, falls back to the default entry point contract for the chain. See [getDefaultEntryPointAddress](/packages/aa-core/utils/getDefaultEntryPointAddress.html#getdefaultentrypointaddress).

- `feeEstimator?: ClientMiddlewareFn` -- [optional] an override for the fee estimator middleware. The `feeEstimator` middleware function calculates `maxFeePerGas` and `maxPriorityFeePerGas` for your User Operation.

- `gasEstimator?: ClientMiddlewareFn` -- [optional] an override for the gas estimator middleware. The `gasEstimator` middleware function calculates the gas fields of your User Operation.

- `customMiddleware?: ClientMiddlewareFn` -- [optional] if you would like to run a custom transformation on your User Operation after Gas and Fee estimation, but before your paymaster is called, you can provide a custom middleware function here.

- `paymasterAndData?: ClientMiddlewareConfig["paymasterAndData"]` -- [optional] if you would like to use a paymaster, then this config must be supplied.

  - `paymasterAndData: ClientMiddlewareFn` -- this middleware function calculates the paymaster and data fields of your User Operation after estimating gas and fees
  - `dummyPaymasterAndData: () => Hex` -- this just returns a Hex string to be used during gas and fee estimation. This will depend on your paymaster provider and must be a value that accurately resembles the gas cost of using your paymaster and does not revert during validation.

- `opts: SmartAccountClientOpts | undefined` -- [optional] overrides on provider config variables having to do with fetching transaction receipts and fee computation.

  - `txMaxRetries: string | undefined` -- [optional] the maximum number of times to try fetching a transaction receipt before giving up (default: 5).

  - `txRetryIntervalMs: string | undefined` -- [optional] the interval in milliseconds to wait between retries while waiting for transaction receipts (default: 2_000).

  - `txRetryMultiplier: string | undefined` -- [optional] the mulitplier on interval length to wait between retries while waiting for transaction receipts (default: 1.5).

  - `feeOptions:` [`UserOperationFeeOptions`](/packages/aa-core/smart-account-client/types/userOperationFeeOptions.md) `| undefined` --[optional] user operation fee options to be used for gas estimation, set at the global level on the provider.
    If not set, default fee options for the chain are used. Available fields in `feeOptions` include `maxFeePerGas`, `maxPriorityFeePerGas`, `callGasLimit`, `preVerificationGas`, `verificationGasLimit` where each field is of type [`UserOperationFeeOptionsField`](/packages/aa-core/smart-account-client/types/userOperationFeeOptionsField.md).

    - `maxFeePerGas`: `UserOperationFeeOptionsField`
    - `maxPriorityFeePerGas`: `UserOperationFeeOptionsField`
    - `callGasLimit`: `UserOperationFeeOptionsField`
    - `verificationGasLimit`: `UserOperationFeeOptionsField`
    - `preVerificationGas`: `UserOperationFeeOptionsField`
