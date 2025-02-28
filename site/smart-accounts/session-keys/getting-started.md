---
outline: deep
head:
  - - meta
    - property: og:title
      content: Getting Started with Session Keys
  - - meta
    - name: description
      content: Learn how to use Alchemy's Session Key Plugin.
  - - meta
    - property: og:description
      content: Learn how to use Alchemy's Session Key Plugin.
  - - meta
    - name: twitter:title
      content: Getting Started with Session Keys
  - - meta
    - name: twitter:description
      content: Learn how to use Alchemy's Session Key Plugin.
---

# Getting Started with Session Keys

`@alchemy/aa-accounts` exports all of the definitions you need to use session keys with a Modular Account. We provide a simple `SessionKeySigner` class that generates session keys on the client and can be used as the `owner` for the Multi Owner Modular Account.
We also export the necessary decorators which can be used to extend your `SmartAccountClient` to make interacting with session keys easy.

## Usage

Let's take a look at a full example that demonstrates how to use session keys with a Modular Account.

<<< @/snippets/session-keys/full-example.ts

## Breaking it down

### Determine where the session key is stored

Session keys can be held on the client side or on a backend agent. Client side session keys are useful for skipping confirmations, and agent side keys are useful for automations.

In the above example, we use a client-side key using the the `SessionKeySigner` exported from `@alchemy/aa-accounts`.

```ts
import { SessionKeySigner } from "@alchemy/aa-accounts";

const sessionKeySigner = new SessionKeySigner();
```

If you are using backend agent controlled session keys, then the agent should generate the private key and send only the address to the client. This protects the private key by not exposing it to the user.

### Extend your client with Modular Account Decorators

The base `SmartAccountClient` and `AlchemySmartAccountClient`, only include base functionality for sending user operations. If you are using a `ModularAccount`, then you'll want to extend your client with the various decorators exported by `@alchemy/aa-accounts`.

::: code-group

```ts
import { smartAccountClient } from "./smartAccountClient";
import {
  accountLoupeActions,
  multiOwnerPluginActions,
  sessionKeyPluginActions,
  pluginManagerActions,
} from "@alchemy/aa-accounts";

const extendedClient = smartAccountClient
  .extend()
  // These are the base decorators for using Modular Accounts with your client
  .extend(pluginManagerActions)
  .extend(accountLoupeActions)
  // These two decorators give you additional utilities for interacting with the
  // MultiOwnerPlugin (default ownership plugin)
  // and SessionKeyPlugin
  .extend(multiOwnerPluginActions)
  .extend(sessionKeyPluginActions);
```

<<< @/snippets/aa-alchemy/base-client.ts [smartAccountClient.ts]
:::

### Check if the Session Key Plugin is installed

Before you can start using session keys, you need to check whether the user’s account has the session key plugin installed. You can perform this check using the account loupe decorator, which lets you inspect the state of installed plugins on a Modular Account.

```ts
// 1. check if the plugin is installed
const extendedClient = await client
  .getInstalledPlugins({})
  // This checks using the default address for the chain, but you can always pass in your own plugin address here as an override
  .then((x) => x.includes(SessionKeyPlugin.meta.addresses[chain.id]));
```

### Install the Session Key Plugin

If the Session Key Plugin is not yet installed, you need to install it before it can be used. To simplify the workflow, it is also possible to batch the plugin installation along with creating session keys and performing other actions, which combines all of these steps into one user operation.

```ts
// 2. if the plugin is not installed, then install it and set up the session key
if (!isPluginInstalled) {
  // lets create an initial permission set for the session key giving it an eth spend limit
  // if we don't set anything here, then the key will have 0 permissions
  const initialPermissions =
    new SessionKeyPermissionsBuilder().setNativeTokenSpendLimit({
      spendLimit: 1000000n,
    });

  const { hash } = await extendedClient.installSessionKeyPlugin({
    // 1st arg is the initial set of session keys
    // 2nd arg is the tags for the session keys
    // 3rd arg is the initial set of permissions
    args: [
      [await sessionKeySigner.getAddress()],
      ["0x0"],
      [initialPermissions.encode()],
    ],
  });

  await extendedClient.waitForUserOperationTransaction({ hash });
}
```

### Construct the initial set of permissions

Session keys are powerful because of permissions that limit what actions they can take. When you add a session key, you should also specify the initial permissions that apply over the key.

**Default Values**

Permissions start with the following default values:

| Permission               | Default Value                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Access control list      | Type: allowlist <br /> The list starts empty. When the allowlist is empty, all calls will be denied.                                             |
| Time range               | Unlimited                                                                                                                                        |
| Native token spend limit | 0 <br /> This means all calls spending the native token will be denied, unless the limit is updated or removed.                                  |
| ERC-20 spend limit       | Unset. If you want to enabled an ERC-20 spend limit, add the ERC-20 token contract to the access control list and set the spending limit amount. |
| Gas spend limits         | Unset. When defining the session key’s permissions, you should specify either a spending limit or a required paymaster.                          |

Importance of gas limits

Gas spend limits are critically important to protecting the account. If you are using a session key, you should configure either a required paymaster rule or a gas spend limit. Failing to do so could allow a malicious session key to drain the account’s native token balance.

::: details View the full set of supported permissions here

<!-- TODO move this in to the docs section in packages overview --->

<<< @/../packages/accounts/src/msca/plugins/session-key/permissions.ts
:::

Let's use the permission builder to build a set of permissions that sets a spend limit:

```ts
const initialPermissions =
  new SessionKeyPermissionsBuilder().setNativeTokenSpendLimit({
    spendLimit: 1000000n,
  });

const result = await extendedClient.updateKeyPermissions({
  args: [sessionKeyAddress, initialPermissions.encode()],
});
```

## Creating, deleting, and editing session keys

### Add a session Key

Session keys can be added either during installation, or using the `addSessionKey` function.

<<< @/snippets/session-keys/add-session-key.ts

### Remove a Session Key

Session keys can be removed using the `removeSessionKey` function.

<<< @/snippets/session-keys/remove-session-key.ts

### Update a Key's Permissions

Session key permissions can be edited after creation using the `updateKeyPermissions` function. Note that you should configure initial permissions when the key is added, and not rely on a second user operation to set the permissions.

<<< @/snippets/session-keys/update-session-key.ts

### Rotate a Session Key

If the key is no longer available, but there exists a tag identifying a previous session key configured for your application, you may instead choose to rotate the previous key’s permissions. This can be performed using `rotateKey` .

<<< @/snippets/session-keys/rotate-session-key.ts
