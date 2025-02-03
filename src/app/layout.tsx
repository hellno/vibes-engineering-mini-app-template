/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { getSession } from "~/auth";
import { ThemeProvider } from "~/components/providers/theme-provider";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { AppSidebar } from "~/components/app-sidebar";
import { NavActions } from "~/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export const metadata: Metadata = {
  title: PROJECT_TITLE,
  description: PROJECT_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers session={session}>
          <SidebarProvider>
            {/* <AppSidebar /> */}
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2">
                <div className="flex flex-1 items-center gap-2 px-3">
                  {/* 
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                  */}
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbPage className="ml-2 line-clamp-1">
                          {PROJECT_TITLE}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div className="ml-auto px-3 flex items-center gap-2">
                  <ThemeToggle />
                  <NavActions />
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 px-4 py-10">
                {children}
                {/* <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
                <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" /> 
                */}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </ThemeProvider>
      </body>
    </html>
  );
}
