import { Metadata } from "next";
import App from "./app";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

const appUrl =
  process.env.NEXT_PUBLIC_URL ||
  `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

// DANGER ZONE: CRITICAL Frame v2 metadata - ONLY modify if explicitly requested
// This frame config is REQUIRED for Farcaster mini app functionality
// Breaking this will break the entire mini app - modify with extreme caution
// Safe to change: button.title, splashBackgroundColor, name
// NEVER change: version, action.type, action structure
const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: "Open",
    action: {
      type: "launch_frame",
      name: PROJECT_TITLE,
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};
// END DANGER ZONE

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: PROJECT_TITLE,
    metadataBase: new URL(appUrl),
    openGraph: {
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
