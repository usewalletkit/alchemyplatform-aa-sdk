---
outline: deep
head:
  - - meta
    - property: og:title
      content: EthersProviderAdapter • constructor
  - - meta
    - name: description
      content: Overview of the constructor method on EthersProviderAdapter in aa-ethers
  - - meta
    - property: og:description
      content: Overview of the constructor method on EthersProviderAdapter in aa-ethers
---

# constructor

There are two ways to construct `EthersProviderAdapter`. You can provide either the `rpcProvider` and `chainId` to have the `EthersProviderAdapter` constructor, which will initialize the `SmartAccountClient` using the input parameters internally.

Or you can also input a `SmartAccountClient` instance already initialized (`AlchemyProvider` for instance) to the `EthersProviderAdapter` constructor.

## Usage

::: code-group

```ts [example.ts]
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { getDefaultEntryPointAddress } from "@alchemy/aa-core";
import { EthersProviderAdapter } from "@alchemy/aa-ethers";
import { sepolia } from "@alchemy/aa-core";

// one way to initialize
export const provider = new EthersProviderAdapter({
  rpcProvider: "ALCHEMY_RPC_URL",
  chainId: 80001,
});

// another way to initialize
const accountProvider = new AlchemyProvider({
  apiKey: "ALCHEMY_API_KEY", // replace with your Alchemy API Key
  chain: sepolia,
  entryPointAddress: getDefaultEntryPointAddress(sepolia),
  opts: {
    txMaxRetries: 10,
    txRetryIntervalMs: 2_000,
    txRetryMultiplier: 1.5,
    minPriorityFeePerBid: 100_000_000n,
  },
  feeOpts: {
    baseFeeBufferPercent: 50n,
    maxPriorityFeeBufferPercent: 5n,
    preVerificationGasBufferPercent: 5n,
  },
});
export const anotherProvider = new EthersProviderAdapter({
  accountProvider,
});
```

:::

## Returns

### `EthersProviderAdapter`

A new instance of an `EthersProviderAdapter`.

## Parameters

### `opts: EthersProviderAdapterOpts`

Either:

- `rpcProvider: string | BundlerClient` -- a JSON-RPC URL, or a viem Client that supports ERC-4337 methods and Viem public actions. See [createBundlerClient](/packages/aa-core/bundler-client/index.md).

- `chainId: number` -- the ID of thechain on which to create the provider.

Or:

- `accountProvider: SmartAccountClient` -- See [SmartAccountClient](/packages/aa-core/smart-account-client/index.md).
