import { useApp } from '@/context/AppContext';

const styles: Record<string, string> = {
  encours: 'bg-status-pending/15 text-status-pending border-status-pending/20',
  arrive: 'bg-status-arrived/15 text-status-arrived border-status-arrived/20',
  recupere: 'bg-status-picked/15 text-status-picked border-status-picked/20',
  livre: 'bg-status-delivered/15 text-status-delivered border-status-delivered/20',
};

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useApp();
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-heading font-semibold border ${styles[status] || ''}`}>
      {t(status as any)}
    </span>
  );
}
