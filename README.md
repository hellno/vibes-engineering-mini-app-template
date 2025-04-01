# farcaster frames template

this repo contains a template for Farcaster mini apps (formerly known as frames v2):  
✅ shadcn and tailwindcss for styling  
✅ useFrameSDK hook to easily work with Farcaster mini app environment  
✅ llm_docs folder for bringing context to LLMs  

![farcaster_frame_template_small](https://github.com/user-attachments/assets/38b9ddef-89fa-4864-9397-a70689314da7)

Architecture

The application is structured around the following key layers:

- Providers Layer: Manages global state and configurations, including wallet connections and SDK setup.
- Components Layer: Encapsulates UI elements and interactive features, such as buttons for actions and context displays.
- Hooks and Utilities: Facilitates interactions with the Frame SDK and Wagmi, handling asynchronous operations and state management.

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
