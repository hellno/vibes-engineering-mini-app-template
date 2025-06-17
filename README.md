# vibes engineering mini app template

**TL;DR:** A developer‑friendly Farcaster Mini App starter kit built with Next.js, React, TypeScript, Tailwind CSS, and the Mini Apps SDK. Comes with out‑of‑the‑box wallet auth, file uploads (Supabase), notifications, webhooks, and reusable UI components.

![image](https://github.com/user-attachments/assets/778893f9-ef65-48bd-a3d0-5e2b3e4b3453)

contains a developer-ready template for Farcaster Mini Apps (formerly Frames v2) with out-of-the-box features:

## Examples

Visit `/examples` to see live demos of all the included components and features, including file uploads, payment buttons, and visitor counters.

## Features

- shadcn/ui and Tailwind CSS for UI and styling
- Mini Apps SDK integration via the `useFrameSDK` hook
- Wallet authentication powered by Wagmi
- Supabase file uploads with `FileUpload` and `FileUploadCard` components
- Webhook handling route (`/api/webhook`)
- `BucketExplorer` component for browsing Supabase storage
- Optimized Open Graph image generation
- Drag‑and‑drop Dropzone UI component
- Theme support and toggle via `ThemeProvider` & `ThemeToggle`

## Architecture

This template is organized into several logical layers:

- Providers Layer: Wraps the application with global providers (`WagmiProvider`, `ThemeProvider`, `QueryClientProvider`, `DaimoPayProvider`), managing wallet authentication, theming, and SDK context.
- Components Layer: Houses reusable UI elements (e.g., `FileUpload`, `FileUploadCard`, `BucketExplorer`, `Dropzone`, navigation actions, switchers) built with shadcn/ui and Tailwind CSS.
- Hooks & Utilities: Offers custom hooks like `useFrameSDK`, `useSupabaseUpload`, `useToast`, and `useMobile` for interacting with the Mini Apps SDK, Supabase storage, toasts, and responsive state.
- API Routes: Implements serverless endpoints under `src/app/api` for file uploads (`/api/upload`) and webhook processing (`/api/webhook`).
- Configuration: Controlled via environment variables (`NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). These must be set to your Vibes Engineering Project ID and Supabase credentials for production deployments to enable secure file storage and API access.

Note: To run in production, ensure you have configured the Vibes Engineering Project ID and Supabase endpoint variables; without these, storage uploads and APIs will not function correctly.

## Recent Changes

- Added file upload feature with Supabase, including FileUpload components, and an `/api/upload` endpoint.
- Implemented notification API with `/api/send-notification` endpoint.
- Added webhook handling via `/api/webhook` route.
- Introduced BucketExplorer component for listing Supabase bucket objects.
- Improved Open Graph image generation with `src/app/opengraph-image.tsx`.
- Added Dropzone UI component for drag-and-drop uploads.
- Integrated team switcher and navigation actions UI (`nav-actions.tsx` and `team-switcher.tsx`).
- Enhanced providers: `WagmiProvider` configuration and `theme-provider.tsx`.
- Updated hooks including `useSupabaseUpload` and `useFrameSDK`.

## Run

To run the application, execute the following commands:

```bash
pnpm install
pnpm dev
```

## Integrate changes from Farcaster official template repo

```bash
git remote add upstream https://github.com/farcasterxyz/frames.git
git fetch upstream
git checkout main
git merge upstream/main
```

You can use git rebase upstream/main instead of git merge upstream/main to keep a cleaner git history.
