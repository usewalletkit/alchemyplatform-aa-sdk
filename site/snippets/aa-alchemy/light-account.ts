import { createLightAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, sepolia, type Hex } from "@alchemy/aa-core";

const chain = sepolia;

// The private key of your EOA that will be the owner of Light Account
const PRIVATE_KEY = "0xYourEOAPrivateKey" as Hex;
const owner = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY);

// Create a provider to send user operations from your smart account
const provider = await createLightAccountAlchemyClient({
  // get your Alchemy API key at https://dashboard.alchemy.com
  apiKey: "ALCHEMY_API_KEY",
  chain,
  owner,
});

// Fund your account address with ETH to send for the user operations
// (e.g. Get Sepolia ETH at https://sepoliafaucet.com)
console.log(provider.getAddress()); // Log the smart account address

// Send a user operation from your smart account
const { hash: uoHash } = await provider.sendUserOperation({
  uo: {
    target: "0xTargetAddress", // The desired target contract address
    data: "0xCallData", // The desired call data
    value: 0n, // (Optional) value to send the target contract address
  },
});

console.log(uoHash); // Log the user operation hash

// Wait for the user operation to be mined
const txHash = await provider.waitForUserOperationTransaction({ hash: uoHash });

console.log(txHash); // Log the transaction hash
