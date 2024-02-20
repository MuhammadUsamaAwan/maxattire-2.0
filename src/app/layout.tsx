import type { Metadata, Viewport } from 'next';

import { siteConfig } from '~/config/site';
import { fontSans } from '~/lib/fonts';
import { absoluteUrl, cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/toaster';
import { TooltipProvider } from '~/components/ui/tooltip';
import { ThemeProvider } from '~/components/layouts/theme-provider';

import '~/styles/globals.css';

import { SiteHeader } from '~/components/layouts/site-header';

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('flex min-h-dvh flex-col font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={500}>
            <SiteHeader />
            <div className='flex-1'>{children}</div>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
