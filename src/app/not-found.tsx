import Container from '@/components/Container';
import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import { DEFAULT_LOCALE } from '@/i18n/config';

export default function NotFound() {
  // Server component: no atom access, so render with the default locale.
  const t = getDictionary(DEFAULT_LOCALE);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-amber-300 via-orange-400 to-red-400">
      <Container className="max-w-md p-10 text-center space-y-3">
        <p className="text-white text-6xl font-extralight tracking-tighter">
          {t.errors.notFoundCode}
        </p>
        <p className="text-white/80 font-light">{t.errors.notFoundTitle}</p>
        <Link
          href="/"
          className="inline-block mt-2 px-4 py-2 rounded-full border border-white/30 text-white/90 text-sm font-light hover:bg-white/20 transition-colors"
        >
          {t.errors.backHome}
        </Link>
      </Container>
    </div>
  );
}
