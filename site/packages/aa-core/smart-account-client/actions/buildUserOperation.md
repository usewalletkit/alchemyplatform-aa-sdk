---
outline: deep
head:
  - - meta
    - property: og:title
      content: buildUserOperation
  - - meta
    - name: description
      content: Overview of the buildUserOperation method on ISmartAccountClient
  - - meta
    - property: og:description
      content: Overview of the buildUserOperation method on ISmartAccountClient
---

# buildUserOperation

Builds an _unsigned_ `UserOperation` (UO) struct with the all of the middleware run on it through the middleware pipeline.

The order of the middlewares is:

1.  `dummyPaymasterDataMiddleware` -- populates a dummy paymaster data to use in estimation (default: "0x")
2.  `feeDataGetter` -- sets maxfeePerGas and maxPriorityFeePerGas
3.  `gasEstimator` -- calls eth_estimateUserOperationGas
4.  `paymasterMiddleware` -- used to set paymasterAndData. (default: "0x")
5.  `customMiddleware` -- allows you to override any of the results returned by previous middlewares

Note that `to` field of transaction is required, and among other fields of transaction, only `data`, `value`, `maxFeePerGas`, `maxPriorityFeePerGas` fields are considered and optional.

## Usage

::: code-group

```ts [example.ts]
import { smartAccountClient } from "./smartAccountClient";
// [!code focus:99]
// build single
const uoStruct = await smartAccountClient.buildUserOperation({
  uo: {
    target: TO_ADDRESS,
    data: ENCODED_DATA,
    value: VALUE, // optional
  },
});
const { hash: uoHash } = await smartAccountClient.sendUserOperation({
  uo: uoStruct,
});

// build batch
const batchedUoStruct = await smartAccountClient.buildUserOperation({
  uo: [
    {
      data: "0xCalldata",
      target: "0xTarget",
    },
    {
      data: "0xCalldata2",
      target: "0xTarget2",
      value: 1000n, // in wei
    },
  ],
});
const { hash: batchedUoHash } = await smartAccountClient.sendUserOperation({
  uo: batchedUoStruct,
});
```

<<< @/snippets/aa-core/smartAccountClient.ts
:::

## Returns

### `Promise<UserOperationStruct>`

A Promise containing the _unsigned_ UO struct resulting from the middleware pipeline

## Parameters

### `uo: UserOperationCallData | UserOperationCallData[]`

- `target: Address` - the target of the call (equivalent to `to` in a transaction)
- `data: Hex` - can be either `0x` or a call data string
- `value?: bigint` - optionally, set the value in wei you want to send to the target

### `overrides?:` [`UserOperationOverrides`](/packages/aa-core/smart-account-client/types/userOperationOverrides.md)

Optional parameter where you can specify override values for `maxFeePerGas`, `maxPriorityFeePerGas`, `callGasLimit`, `preVerificationGas`, `verificationGasLimit` or `paymasterAndData` on the user operation request

### `account?: SmartContractAccount`

If your client was not instantiated with an account, then you will have to pass the account in to this call.
