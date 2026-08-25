'use client';

import Container from '@/components/Container';
import { RotateCcw } from 'lucide-react';
import { getWeatherGradient } from '@/utils/getWeatherGradient';
import { useI18n } from '@/hooks/useI18n';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useI18n();
  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 bg-gradient-to-br transition-all duration-500 ${getWeatherGradient()}`}
    >
      <Container className="max-w-md p-8 text-center space-y-4">
        <p className="text-white text-lg font-light">{t.errors.genericTitle}</p>
        <p className="text-white/70 text-sm font-light break-words">{error.message}</p>
        {error.digest && <p className="text-white/40 text-xs font-light">Ref: {error.digest}</p>}
        <button
          onClick={reset}
          aria-label={t.errors.tryAgain}
          className="inline-flex items-center gap-2 px-4 py-2 mx-auto rounded-full border border-white/30 text-white/90 text-sm font-light hover:bg-white/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          {t.errors.tryAgain}
        </button>
      </Container>
    </div>
  );
}
