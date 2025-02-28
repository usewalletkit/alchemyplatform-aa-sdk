---
outline: deep
head:
  - - meta
    - property: og:title
      content: ISmartAccountClient • signMessage
  - - meta
    - name: description
      content: Overview of the signMessage method on ISmartAccountClient
  - - meta
    - property: og:description
      content: Overview of the signMessage method on ISmartAccountClient
---

# signMessage

This method signs messages using the connected account with [ERC-191](https://eips.ethereum.org/EIPS/eip-191) standard.

## Usage

::: code-group

```ts [example.ts]
import { smartAccountClient } from "./smartAccountClient";
// [!code focus:99]
const signedMessage = await smartAccountClient.signMessage({ message: "msg" });
```

<<< @/snippets/aa-core/smartAccountClient.ts

:::

## Returns

### `Promise<Hash>`

The signed hash for the message passed

## Parameters

### `message: SignableMessage`

Message to be signed represented as a viem [`SignableMessage`](https://viem.sh/docs/actions/wallet/signMessage.html#signmessage)

### `account?: SmartContractAccount`

If your client was not instantiated with an account, then you will have to pass the account in to this call.
