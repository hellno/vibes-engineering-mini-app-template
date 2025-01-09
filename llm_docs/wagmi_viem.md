Introduction to wagmi and viem

wagmi is a cutting-edge TypeScript library built on React that simplifies Ethereum application development. It offers a rich set of hooks for wallet connection, contract interaction, and blockchain state management. By focusing on developer experience, type safety, and composability, wagmi provides an accessible yet powerful framework for building decentralized applications (dApps).

viem complements wagmi by acting as a low-level, stateless Ethereum client. Designed with performance, bundle size, and developer productivity in mind, viem provides type-safe, highly optimized interfaces for interacting with Ethereum’s JSON-RPC API and smart contracts.

Together, wagmi and viem form a robust stack for Ethereum development, catering to both high-level needs (via React hooks) and low-level blockchain interactions.

Recent Updates and Migration Changes

The transition to wagmi v2 and deeper integration with viem marks a significant milestone in the evolution of Ethereum tooling. These changes enhance usability and performance but require developers to update their projects to align with the latest API design.

Key Migration Highlights
	1.	viem Integration:
	•	wagmi now uses viem as its underlying Ethereum client, replacing the ethers.js peer dependency.
	•	viem’s lightweight, TypeScript-first approach introduces better type inference and reduced bundle sizes.
	2.	Hook Renaming:
	•	Hooks such as useSigner have been renamed to useWalletClient to align with viem’s terminology.
	•	Similar changes affect other hooks, e.g., getSigner is now getWalletClient.
	3.	useContractWrite Enhancements:
	•	The abi parameter in useContractWrite now requires a const assertion to enable precise type inference for functionName and args.
	•	Improved API for dynamic argument passing during contract interactions.
	4.	Deprecated Hooks:
	•	The usePrepareContractWrite hook has been removed, simplifying the contract write workflow in favor of direct usage of writeContract from viem.
	5.	Improved Error Handling and Types:
	•	viem provides better error messages, strict type enforcement, and an enhanced developer experience compared to ethers.js.

Why These Changes Matter

These updates prioritize:
	•	Performance: Smaller and faster builds due to viem’s optimized architecture.
	•	Type Safety: Comprehensive TypeScript support with type inference for ABI definitions and contract calls.
	•	Future-Proofing: A streamlined and modular API that encourages best practices in Ethereum development.

Example: Updated useContractWrite

Before (wagmi v1 with ethers):

import { useContractWrite } from 'wagmi';

const { write } = useContractWrite({
  addressOrName: '0xContractAddress',
  contractInterface: abi,
  functionName: 'mint',
});

After (wagmi v2 with viem):

import { useContractWrite } from 'wagmi';

const abi = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const;

const { write } = useContractWrite({
  address: '0xContractAddress',
  abi,
  functionName: 'mint',
});

Conclusion

The integration of wagmi and viem sets a new standard for Ethereum development by combining high-level abstractions with low-level control. While the migration introduces breaking changes, these updates unlock significant benefits for developers, including better performance, smaller bundles, and more robust type safety.

By adopting these changes and exploring their new capabilities, developers can build scalable, maintainable, and future-proof dApps. For migration details and updated documentation, visit:

https://wagmi.sh/react/getting-started

https://viem.sh/docs/getting-started.html 
