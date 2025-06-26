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
- **`useMiniAppSdk()`**: Primary hook for Farcaster Mini App SDK integration
- **`useSupabaseUpload()`**: File upload functionality
- **`useProfile()`**: User profile management
- **`useMobile()`**: Mobile device detection

### API Routes Structure
- **`/api/webhook`**: Handles Farcaster webhook events
- **`/api/upload`**: Supabase file upload endpoint
- **`/api/get-jwt`**: JWT token generation for authenticated requests

### Environment Variables Required
- `NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID`: Project identifier
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog analytics key (optional)
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host (optional)
- `VIBES_ENGINEERING_NOTIFICATION_BACKEND_ENDPOINT`: Webhook backend endpoint

### File Structure Patterns
- **Components**: `src/components/` - Reusable UI components
- **UI Components**: `src/components/ui/` - shadcn/ui components
- **Providers**: `src/components/providers/` - Context providers
- **Hooks**: `src/hooks/` - Custom React hooks
- **Lib**: `src/lib/` - Utility functions and configurations
- **App**: `src/app/` - Next.js App Router pages and API routes

### Important Implementation Notes
- **Mini App SDK**: The `sdk.actions.ready({})` call in `useMiniAppSdk()` is critical - don't remove it
- **Path Alias**: Use `~/` for imports from `src/` directory
- **Styling**: Follow shadcn/ui patterns and use Tailwind CSS classes
- **State Management**: Uses React Query for server state, React Context for client state
- **Authentication**: Wallet-based auth through Wagmi + Farcaster Frame connector


### Development Workflow
1. Components should follow existing patterns in `src/components/`
2. Use the existing provider structure - don't create new top-level providers
3. File uploads go through the `/api/upload` endpoint with Supabase
4. All Web3 interactions should use the configured Wagmi setup
5. Follow the existing TypeScript path aliases (`~/`)

### Component Integration Pattern
**IMPORTANT**: When adding new components or functionality:
- **DO NOT** modify `src/app/page.tsx` - this is the entry point and rarely needs changes
- **START** integration in `src/app/app.tsx` - this is the main user-facing component
- Always ensure new components are properly integrated into the user interface, not just created as isolated files
- New features should be accessible from the main app flow in `src/app/app.tsx`

### Chain Configuration
Supports Base, Degen, Mainnet, and Optimism chains via Wagmi configuration in `src/components/providers/WagmiProvider.tsx`.