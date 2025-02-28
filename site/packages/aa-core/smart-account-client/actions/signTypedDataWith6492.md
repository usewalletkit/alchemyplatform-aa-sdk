---
outline: deep
head:
  - - meta
    - property: og:title
      content: ISmartAccountClient • signTypedDataWith6492
  - - meta
    - name: description
      content: Overview of the signTypedDataWith6492 method on ISmartAccountClient
  - - meta
    - property: og:description
      content: Overview of the signTypedDataWith6492 method on ISmartAccountClient
---

# signTypedDataWith6492

This method supports signing typed data for deployed smart accounts, as well as undeployed accounts (counterfactual addresses) using [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

## Usage

::: code-group

```ts [example.ts]
import { smartAccountClient } from "./smartAccountClient";
// [!code focus:99]
// sign typed data (works for undeployed and deployed accounts)
const signedTypedDataWith6492 = smartAccountClient.signTypedDataWith6492({
  domain: {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  },
  types: {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  },
  primaryType: "Mail",
  message: {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  },
});
```

<<< @/snippets/aa-core/smartAccountClient.ts

:::

## Returns

### `Promise<Hash>`

A Promise containing the signature of the typed data, additionally wrapped in ERC-6492 format if the account is undeployed.

## Parameters

### `params: SignTypedDataParams`

The typed data to sign

- `domain: TypedDataDomain` -- The typed data domain
- `types: Object` -- the type definitions for the typed data
- `primaryType: inferred String` -- the primary type to extract from types and use in value
- `message: inferred from types & primaryType` -- the message, inferred from

### `account?: SmartContractAccount`

If your client was not instantiated with an account, then you will have to pass the account in to this call.
