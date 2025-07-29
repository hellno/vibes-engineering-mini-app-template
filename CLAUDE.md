# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Package Management
- Use `pnpm` as the package manager (not npm or yarn)
- Install dependencies: `pnpm install`
- Run development server: `pnpm dev`
- Build for production: `pnpm build`
- Start production server: `pnpm start`
- Lint code: `pnpm lint`

### Testing
- No specific test framework is configured - check with the user before adding tests

### Git Operations
- When committing, exclude `.pnpm-deps-hash` changes: `git checkout HEAD .pnpm-deps-hash`
- To sync with upstream Farcaster template: `git fetch upstream && git merge upstream/main`

## Architecture Overview

This is a **Farcaster Mini App template** built with Next.js 15, React 19, TypeScript, and Tailwind CSS. It's designed for building mini applications that run within the Farcaster ecosystem.

### Core Technologies
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** + **shadcn/ui** for styling
- **Farcaster Frame SDK** for mini app functionality
- **Wagmi** for Web3 wallet integration
- **Supabase** for file storage and database
- **PostHog** for analytics
- **Daimo Pay** for payment integration

### Provider Architecture
The app uses a nested provider pattern in `src/app/providers.tsx`:
1. **WagmiProvider**: Wallet connection and Web3 functionality
2. **PostHogProvider**: Analytics and user tracking
3. **ThemeProvider**: Dark/light theme management
4. **QueryClientProvider**: React Query for data fetching
5. **DaimoPayProvider**: Payment processing

### Key Hooks and Utilities
- **`useMiniAppSdk()`**: Primary hook for Farcaster Mini App SDK integration (formerly `useFrameSDK`)
- **`useSupabaseUpload()`**: File upload functionality with Supabase storage
- **`useProfile()`**: User profile management
- **`useMobile()`**: Mobile device detection
- **`useToast()`**: Toast notification system

### Chain Configuration
Supports Base, Arbitrum, Optimism, Celo, Mainnet, and Monad Testnet chains via Wagmi configuration in `src/components/providers/WagmiProvider.tsx`.

### Key Libraries and APIs
- **Alchemy SDK**: For blockchain data and NFT operations
- **Neynar SDK**: For Farcaster user search and profiles
- **Daimo Pay**: For payment processing within mini apps

## File Structure and Organization

- **App Router**: `src/app/` - Next.js App Router pages and API routes
- **Components**: `src/components/` - Reusable UI components
- **UI Components**: `src/components/ui/` - shadcn/ui components and pre-installed mini app components
- **Providers**: `src/components/providers/` - Context providers
- **Hooks**: `src/hooks/` - Custom React hooks
- **Lib**: `src/lib/` - Utility functions and configurations

## Development Guidelines

### Component Development
- Write client components in `src/components/`
- Use minimal, self-contained components with clear props
- Default export components
- Follow existing patterns in `src/components/`
- Always satisfy react/no-unescaped-entities: escape special chars in JSX, use &apos; or alternatives

### API Development
- Write server functions in `src/app/api/`
- Available routes:
  - `/api/webhook`: Handles Farcaster webhook events
  - `/api/upload`: Supabase file upload endpoint
  - `/api/get-jwt`: JWT token generation for authenticated requests
- Always create server functions instead of calling external APIs directly from frontend
- Use Route Handlers pattern with `route.ts` files

### Styling
- Use Tailwind CSS + shadcn/ui components
- Prioritize mobile-first design (mini apps are primarily mobile)
- Use inline Tailwind utilities as much as possible
- Add extra styling libraries sparingly

### Additional Development Notes
- **Path Alias**: Use `~/` for imports from `src/` directory
- **State Management**: React Query for server state, React Context for client state
- **Authentication**: Wallet-based auth through Wagmi + Farcaster Frame connector
- **Mini App SDK**: The `sdk.actions.ready({})` call in `useMiniAppSdk()` is critical - don't remove it
- **Web3**: Use wagmi v2 and viem for onchain interactions
- **File Uploads**: Use the `/api/upload` endpoint with Supabase
- **Provider Structure**: Use existing providers, don't create new top-level providers

## Component Integration Pattern

When creating new components:
1. Create the component in `src/components/`
2. Update `src/app/app.tsx` to import and render it
3. Replace placeholder content between `TEMPLATE_CONTENT_START` and `TEMPLATE_CONTENT_END`
4. Ensure components are visible and usable by end users
5. Never leave components unintegrated - creating without showing is incomplete work

## Protected Files Policy

### DO NOT MODIFY
- `src/app/page.tsx` - Contains critical mini app infrastructure
- `src/app/layout.tsx` - Contains essential mini app metadata

### Integration Approach
- **Primary method**: Always integrate new features in `src/app/app.tsx`
- **If page.tsx modification is absolutely necessary**:
  1. Read the existing file first
  2. Preserve all mini app metadata and scaffolding
  3. Make only additive changes within existing structure
  4. Never replace entire page content

## Pre-installed Components

All mini-app UI components are pre-installed in `~/components/ui/`:
- `daimo-pay-transfer-button`: Custom button for transferring tokens with Daimo Pay
- `share-cast-button`: Button for sharing a cast on Farcaster
- `add-miniapp-button`: Button to add or pin a mini app
- `show-coin-balance`: Display coin balance for an address using Alchemy SDK
- `avatar`: Customizable avatar component with fallbacks
- `user-context`: Display user information with avatar and username
- `nft-card`: Versatile NFT display with multi-chain support
- `nft-mint-button`: NFT minting button with provider auto-detection
- `nft-mint-flow`: Universal NFT minting component with auto-detection
- `profile-search`: Search Farcaster users with Neynar API
- `onchain-user-search`: Search onchain users with ENS and wallet addresses
- `button`, `input`, `card`, `sheet`: Base UI components from shadcn/ui

Import using: `import { ComponentName } from "~/components/ui/component-name"`

### Additional Components
- `FileUpload` / `FileUploadCard`: Supabase file upload components
- `BucketExplorer`: Browse files in Supabase storage buckets
- `Dropzone`: Drag-and-drop file upload UI
- `VisitorCounter`: Track and display visitor counts
- `ExampleComponents`: Demonstration of all available components

## Environment Variables

Required:
- `NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID`: Project identifier
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VIBES_ENGINEERING_NOTIFICATION_BACKEND_ENDPOINT`: Webhook backend endpoint

Optional:
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog analytics key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host
- `NEXT_PUBLIC_ALCHEMY_KEY`: Alchemy API key for enhanced blockchain operations

## Critical Implementation Notes

### Mini App SDK Integration
- The `sdk.actions.ready({})` call in `useMiniAppSdk()` is essential - removing it will break the mini app
- Always check `isSDKLoaded` before using SDK features
- The SDK provides context about the current Farcaster user and environment

### NFT Operations
- NFT minting uses auto-detection via `provider-detector.ts` and `nft-standards.ts`
- Supports multiple providers: Manifold, Zora, Rodeo, Base, and custom contracts
- Price optimization handled by `price-optimizer.ts`
- Metadata utilities in `nft-metadata-utils.ts` for fetching NFT details

### Supabase Integration
- File uploads require valid Supabase credentials in environment variables
- Use `useSupabaseUpload()` hook for upload functionality
- Storage buckets can be explored with the `BucketExplorer` component

### Webhook Handling
- Webhook endpoint at `/api/webhook` processes Farcaster events
- Requires `VIBES_ENGINEERING_NOTIFICATION_BACKEND_ENDPOINT` for notifications

## Git Commit Guidelines

- Ignore `.pnpm-deps-hash` changes (auto-generated)
- Use `git checkout HEAD .pnpm-deps-hash` before committing
- Only commit actual code changes
