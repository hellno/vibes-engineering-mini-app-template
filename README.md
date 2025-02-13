# farcaster frames template

This repo contains a template for Farcaster v2 frames:  
✅ shadcn and tailwindcss for styling
✅ custom font in OpenGraph image
✅ llm_docs folder for bringing context to LLMs

Architecture

The application is structured around the following key layers:
• Providers Layer: Manages global state and configurations, including wallet connections and SDK setup.
• Components Layer: Encapsulates UI elements and interactive features, such as buttons for actions and context displays.
• Hooks and Utilities: Facilitates interactions with the Frame SDK and Wagmi, handling asynchronous operations and state management.

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
