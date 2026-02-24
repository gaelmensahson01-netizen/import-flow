import { useApp } from '@/context/AppContext';

export default function TransportBadge({ transport }: { transport: 'avion' | 'bateau' | 'mix' }) {
  const { t } = useApp();

  if (transport === 'avion') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold bg-gold/15 text-gold border border-gold/20">
        ✈️ {t('avion')}
      </span>
    );
  }
  if (transport === 'bateau') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold bg-sea-blue/15 text-sea-blue border border-sea-blue/20">
        🚢 {t('bateau')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold border border-gold/20"
      style={{ background: 'linear-gradient(90deg, hsl(42 65% 58% / 0.15), hsl(215 75% 48% / 0.15))' }}
    >
      <span className="bg-gradient-to-r from-gold to-sea-blue bg-clip-text text-transparent">✈️🚢 {t('mix')}</span>
    </span>
  );
}
