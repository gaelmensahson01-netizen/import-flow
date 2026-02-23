import { useApp } from '@/context/AppContext';

const styles: Record<string, string> = {
  encours: 'bg-status-pending text-nav',
  arrive: 'bg-status-arrived text-nav-foreground',
  recupere: 'bg-status-picked text-nav',
  livre: 'bg-status-delivered text-nav-foreground',
};

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useApp();
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-heading font-bold uppercase ${styles[status] || ''}`}>
      {t(status as any)}
    </span>
  );
}
