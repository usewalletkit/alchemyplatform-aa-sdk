---
outline: deep
head:
  - - meta
    - property: og:title
      content: 3rd Paymasters
  - - meta
    - name: description
      content: Learn how to use a 3rd Party Paymaster with Account Kit
  - - meta
    - property: og:description
      content: Learn how to use a 3rd Party Paymaster with Account Kit
  - - meta
    - name: twitter:title
      content: 3rd Paymasters
  - - meta
    - name: twitter:description
      content: Learn how to use a 3rd Party Paymaster with Account Kit
---

# Using a 3rd Party Paymaster

The `SmartAccountClient` within `@alchemy/aa-core` is unopinionated about which paymaster you use, so you can connect to any paymaster really simply. Configuration is done using the the `paymasterAndData` config option when you call `createSmartAccountClient`.

## Usage

```ts
import { createSmartAccountClient } from "@alchemy/aa-core";
import { sepolia } from "viem";

const chain = sepolia;
const client = createSmartAccountClient({
  chain,
  transport: http("RPC_URL"),
  paymasterAndData: {
    paymasterAndData: async (userop, opts) => {
        // call your paymaster here to sponsor the userop
        // leverage the `opts` field to apply any overrides
        return {
            ...userop,
            paymasterAndData: "0xresponsefromprovider"
        }
    },
    dummyPaymasterAndData: () => "0xnonrevertingpaymasterandata,
  },
});

```
