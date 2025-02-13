'use client'

import { ThemeProvider } from "~/components/providers/theme-provider";

export function ThemeProviderClient({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
