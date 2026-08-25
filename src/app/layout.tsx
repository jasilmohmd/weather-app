import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import ThemeSync from '@/components/ThemeSync';
import PwaRegister from '@/components/PwaRegister';
import LocaleSync from '@/components/LocaleSync';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Real-time weather forecasts powered by OpenWeatherMap',
  appleWebApp: {
    capable: true,
    title: 'Weather',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#fb923c',
};

// Applies the persisted theme before first paint to prevent a flash of the wrong theme.
// Mirrors ThemeSync + jotai atomWithStorage ("weather.theme" stores JSON).
const themeInitScript = `
(function () {
  try {
    var t = JSON.parse(localStorage.getItem("weather.theme")) || "system";
    var dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <ThemeSync />
          <LocaleSync />
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
