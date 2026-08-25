'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from './Container';
import { useI18n } from '@/hooks/useI18n';

interface RadarMapProps {
  lat?: number;
  lon?: number;
}

export default function RadarMap({ lat, lon }: RadarMapProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (typeof lat !== 'number' || typeof lon !== 'number') return null;

  return (
    <Container className="p-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="radar-panel"
        className="w-full flex items-center justify-between text-white/90 font-light text-xl tracking-wide hover:text-white transition-colors"
      >
        {t.radar.heading}
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="radar-panel"
          className="mt-4 relative w-full overflow-hidden rounded-2xl border border-white/20 aspect-[4/3]"
        >
          <iframe
            src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=7&overlay=radar&detailLat=${lat}&detailLon=${lon}&detail=true&location=coordinates`}
            title={t.radar.title(`${lat.toFixed(2)}, ${lon.toFixed(2)}`)}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
        </div>
      )}
    </Container>
  );
}
