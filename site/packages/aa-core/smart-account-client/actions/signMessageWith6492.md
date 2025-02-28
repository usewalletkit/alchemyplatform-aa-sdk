---
outline: deep
head:
  - - meta
    - property: og:title
      content: ISmartAccountClient • signMessageWith6492
  - - meta
    - name: description
      content: Overview of the signMessageWith6492 method on ISmartAccountClient
  - - meta
    - property: og:description
      content: Overview of the signMessageWith6492 method on ISmartAccountClient
---

# signMessageWith6492

This method supports signing messages for deployed smart accounts, as well as undeployed accounts (counterfactual addresses) using [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

## Usage

::: code-group

```ts [example.ts]
import { smartAccountClient } from "./smartAccountClient";
// [!code focus:99]
// sign message (works for undeployed and deployed accounts)
const signedMessageWith6492 = smartAccountClient.signMessageWith6492({
  message: "test",
});
```

<<< @/snippets/aa-core/smartAccountClient.ts

:::

## Returns

### `Promise<Hash>`

A Promise containing the signature of the message, additionally wrapped in EIP-6492 format if the account is undeployed

## Parameters

### `msg: string | Uint8Array`

The message to sign

### `account?: SmartContractAccount`

If your client was not instantiated with an account, then you will have to pass the account in to this call.
