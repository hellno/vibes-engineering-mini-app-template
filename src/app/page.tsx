import { Metadata } from "next";
import App from "./app";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

const appUrl =
  process.env.NEXT_PUBLIC_URL ||
  `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/og-image.png`,
  button: {
    title: "Translate",
    action: {
      type: "launch_frame",
      name: PROJECT_TITLE,
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#a1a1ff",
    },
  },
};

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
