import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEzNTk2LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4ODE3MzE4RDZmRkY2NkExOGQ4M0ExMzc2QTc2RjZlMzBCNDNjODg4OSJ9",
      payload:
        "eyJkb21haW4iOiJmYXJjYXN0ZXItbWluaWFwcC10ZW1wbGF0ZS52ZXJjZWwuYXBwIn0",
      signature:
        "MHg5ZjkyZTdkNjRmZTNhNTE4YTEzOTBmZTdlYzAwOWQzODUzZWM2N2RmOTZiYjg1MzAwOGRlZDExNjVmOGE5OGVlNDQyYmI0MDU3OTI0ZmEzOGE3N2NlYWRiYThiMTRiN2IzMTY5N2ZjYWVlZGM3MTE1YWNiMTFmYjc2Y2EzYTc0YzFj",
    },
    miniapp: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      ogImageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Open",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: "social",
    },
  };

  return Response.json(config);
}
