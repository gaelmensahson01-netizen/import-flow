import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import TransportBadge from '@/components/TransportBadge';
import StatusBadge from '@/components/StatusBadge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Orders() {
  const { orders, deleteOrder, t, formatXOF } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [filterTransport, setFilterTransport] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const months = useMemo(() => {
    const set = new Set(orders.map(o => o.dateOrder?.substring(0, 7)).filter(Boolean));
    return [...set].sort().reverse();
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (search && !normalize(o.client).includes(normalize(search))) return false;
      if (filterStatus && o.status !== filterStatus) return false;
      if (filterTransport && o.transport !== filterTransport) return false;
      if (filterMonth && !o.dateOrder?.startsWith(filterMonth)) return false;
      return true;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [orders, search, filterStatus, filterTransport, filterMonth]);

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-heading font-bold uppercase tracking-wider">{t('orders')}</h2>
        <Link to="/orders/new" className="px-4 py-2 bg-teal text-primary-foreground font-heading font-bold uppercase text-sm rounded-lg hover:bg-teal-light transition-colors">
          + {t('newOrder')}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full h-10 pl-9 pr-8 rounded-lg bg-card border border-border text-card-foreground text-sm focus:border-teal focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">×</button>
          )}
        </div>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="h-10 px-3 rounded-lg bg-card border border-border text-card-foreground text-sm focus:border-teal focus:outline-none">
          <option value="">{t('month')}: {t('all')}</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-lg bg-card border border-border text-card-foreground text-sm focus:border-teal focus:outline-none">
          <option value="">{t('status')}: {t('all')}</option>
          {['encours','arrive','recupere','livre'].map(s => <option key={s} value={s}>{t(s as any)}</option>)}
        </select>
        <select value={filterTransport} onChange={e => setFilterTransport(e.target.value)} className="h-10 px-3 rounded-lg bg-card border border-border text-card-foreground text-sm focus:border-teal focus:outline-none">
          <option value="">{t('transport')}: {t('all')}</option>
          {['avion','bateau','mix'].map(s => <option key={s} value={s}>{t(s as any)}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          {search ? `${t('noResults')} "${search}"` : t('noOrders')}
        </p>
      ) : (
        <div className="overflow-x-auto bg-card rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['client','transport','realPrice','clientPrice','profit','status','dateOrder','actions'].map(col => (
                  <th key={col} className="text-left py-3 px-3 font-heading uppercase text-xs text-muted-foreground whitespace-nowrap">
                    {t(col as any)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{o.client}</td>
                  <td className="py-2.5 px-3"><TransportBadge transport={o.transport} /></td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{formatXOF(o.realPrice)}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{formatXOF(o.clientPrice)}</td>
                  <td className={`py-2.5 px-3 font-amount whitespace-nowrap ${o.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                    {formatXOF(o.profit)}
                  </td>
                  <td className="py-2.5 px-3"><StatusBadge status={o.status} /></td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-muted-foreground">{o.dateOrder}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/orders/${o.id}`} className="hover:text-teal" title={t('view')}>👁</Link>
                      <Link to={`/orders/${o.id}/edit`} className="hover:text-teal" title={t('edit')}>✏️</Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="hover:text-danger" title={t('delete')}>🗑</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('confirmDeleteMsg')}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteOrder(o.id)} className="bg-danger text-primary-foreground hover:bg-danger/90">
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
