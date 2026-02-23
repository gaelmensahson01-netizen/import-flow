import { useApp } from '@/context/AppContext';

export default function TransportBadge({ transport }: { transport: 'avion' | 'bateau' | 'mix' }) {
  const { t } = useApp();

  if (transport === 'avion') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold uppercase bg-gold text-nav">
        {t('avion')}
      </span>
    );
  }
  if (transport === 'bateau') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold uppercase bg-sea-blue text-nav-foreground">
        {t('bateau')}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold uppercase text-nav-foreground"
      style={{ background: 'linear-gradient(90deg, hsl(45 52% 54%), hsl(212 80% 42%))' }}
    >
      {t('mix')}
    </span>
  );
}
