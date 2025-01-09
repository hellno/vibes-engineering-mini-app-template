import type { Metadata } from "next";
import { getSession } from "~/auth"
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";
import "~/app/globals.css";
import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: PROJECT_TITLE,
  description: PROJECT_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  
  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
