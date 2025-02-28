---
outline: deep
head:
  - - meta
    - property: og:title
      content: Using Your Own Smart Account
  - - meta
    - name: description
      content: Follow this guide to use any smart account implementation you want with Account Kit, a vertically integrated stack for building apps that support ERC-4337 and ERC-6900.
  - - meta
    - property: og:description
      content: Follow this guide to use any smart account implementation you want with Account Kit, a vertically integrated stack for building apps that support ERC-4337 and ERC-6900.
  - - meta
    - name: twitter:title
      content: Using Your Own Smart Account
  - - meta
    - name: twitter:description
      content: Follow this guide to use any smart account implementation you want with Account Kit, a vertically integrated stack for building apps that support ERC-4337 and ERC-6900.
---

# Using Your Own Smart Account

You are not limited to the accounts defined in `@alchemy/aa-accounts`. The `SmartAccountClient` can be used with any smart account because it only relies on the [`ISmartContractAccount`](https://github.com/alchemyplatform/aa-sdk/blob/main/packages/core/src/account/types.ts#L8) interface. This means you can use your own smart account implementation with Account Kit.

<!--@include: ../../packages/aa-core/accounts/index.md{21,58}-->

## `LightSmartContractAccount` as an Example

We have built an extension of the eth-infinitism `SimpleAccount` called [LightAccount.sol](https://github.com/alchemyplatform/light-account/blob/main/src/LightAccount.sol). You can learn more about Light Account in the [Light Account documentation](/smart-accounts/light-account/).

We provide an implementation of `SmartContractAccount` that works with `LightAccount.sol` which can be used as an example of how to implement your own Smart Contract Account:
::: details LightSmartContractAccount
<<< @/../packages/accounts/src/light-account/account.ts
:::

## The `toSmartContractAccount` Method

For your reference, this is the definition of the `toSmartContractAccount` interface as pulled from the source code:

::: details SmartContractAccount
<<< @/../packages/core/src/account/smartContractAccount.ts
:::
