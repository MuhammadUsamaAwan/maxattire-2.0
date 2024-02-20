import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { siteConfig } from '~/config/site';
import { fontSans } from '~/lib/fonts';
import { absoluteUrl, cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/toaster';
import { TooltipProvider } from '~/components/ui/tooltip';
import { SiteFooter } from '~/components/layouts/site-footer';
import { SiteHeader } from '~/components/layouts/site-header';
import { ThemeProvider } from '~/components/layouts/theme-provider';

import '~/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: ['/images/favicon.png'],
  verification: {
    google: 'qayK1xEvVXM_a8Kvl538Ujkysr5ZO3GwUO9NHQTCQdE',
  },
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
            <SiteFooter />
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
      <Script id='tawk.io'>
        {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/650b05cfb1aaa13b7a77ef0f/1hapgtdeu';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();`}
      </Script>
    </html>
  );
}
