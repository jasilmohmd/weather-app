import React from 'react';
import { Cloud } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative z-10 mt-auto py-4 px-4">
      <div className="">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center space-y-3">
            {/* Logo/Icon */}
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-white/60" />
              <span className="text-white/60 font-light text-sm tracking-wide">
                {t.footer.appName}
              </span>
            </div>

            {/* Credits */}
            <div className="text-center space-y-1">
              <p className="text-white/40 text-xs font-light">{t.footer.poweredBy}</p>
              <p className="text-white/30 text-xs font-light">{t.footer.madeWith}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
