import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import TransportBadge from '@/components/TransportBadge';
import StatusBadge from '@/components/StatusBadge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Plus, Eye, Pencil, Trash2, MessageCircle, X, Filter } from 'lucide-react';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Orders() {
  const { orders, deleteOrder, t, formatXOF } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [filterTransport, setFilterTransport] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const activeFilters = [filterStatus, filterTransport, filterMonth].filter(Boolean).length;

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-wider">{t('orders')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} / {orders.length} {t('orders').toLowerCase()}</p>
        </div>
        <Link
          to="/orders/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-primary-foreground font-heading font-semibold text-sm rounded-xl hover:bg-teal-light transition-all hover:shadow-lg hover:shadow-teal/20 active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          {t('newOrder')}
        </Link>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full h-11 pl-10 pr-9 rounded-xl glass text-foreground text-sm focus:ring-2 focus:ring-teal/50 focus:outline-none transition-all placeholder:text-muted-foreground/60"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative h-11 px-3.5 rounded-xl glass font-heading text-sm transition-all hover:text-foreground ${showFilters ? 'text-teal ring-1 ring-teal/30' : 'text-muted-foreground'}`}
        >
          <Filter size={16} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="h-9 px-3 rounded-lg glass text-foreground text-xs focus:ring-2 focus:ring-teal/50 focus:outline-none">
            <option value="">{t('month')}: {t('all')}</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg glass text-foreground text-xs focus:ring-2 focus:ring-teal/50 focus:outline-none">
            <option value="">{t('status')}: {t('all')}</option>
            {['encours', 'arrive', 'recupere', 'livre'].map(s => <option key={s} value={s}>{t(s as any)}</option>)}
          </select>
          <select value={filterTransport} onChange={e => setFilterTransport(e.target.value)} className="h-9 px-3 rounded-lg glass text-foreground text-xs focus:ring-2 focus:ring-teal/50 focus:outline-none">
            <option value="">{t('transport')}: {t('all')}</option>
            {['avion', 'bateau', 'mix'].map(s => <option key={s} value={s}>{t(s as any)}</option>)}
          </select>
          {activeFilters > 0 && (
            <button
              onClick={() => { setFilterMonth(''); setFilterStatus(''); setFilterTransport(''); }}
              className="h-9 px-3 rounded-lg text-xs text-danger hover:bg-danger/10 transition-colors font-heading"
            >
              ✕ Reset
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm font-heading">
            {search ? `${t('noResults')} "${search}"` : t('noOrders')}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl glass-strong">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['client', 'transport', 'realPrice', 'clientPrice', 'profit', 'status', 'dateOrder', 'actions'].map(col => (
                    <th key={col} className="text-left py-3.5 px-4 font-heading text-[11px] uppercase tracking-widest text-muted-foreground">
                      {t(col as any)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-border/30 hover:bg-accent/40 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-medium">{o.client}</div>
                      {o.phone && <div className="text-[11px] text-muted-foreground mt-0.5">{o.phone}</div>}
                    </td>
                    <td className="py-3 px-4"><TransportBadge transport={o.transport} /></td>
                    <td className="py-3 px-4 whitespace-nowrap tabular-nums">{formatXOF(o.realPrice)}</td>
                    <td className="py-3 px-4 whitespace-nowrap tabular-nums">{formatXOF(o.clientPrice)}</td>
                    <td className={`py-3 px-4 font-amount whitespace-nowrap ${o.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                      {formatXOF(o.profit)}
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-xs">{o.dateOrder}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link to={`/orders/${o.id}`} className="p-1.5 rounded-lg hover:bg-teal/10 hover:text-teal transition-colors" title={t('view')}>
                          <Eye size={15} />
                        </Link>
                        <Link to={`/orders/${o.id}/edit`} className="p-1.5 rounded-lg hover:bg-teal/10 hover:text-teal transition-colors" title={t('edit')}>
                          <Pencil size={15} />
                        </Link>
                        {o.phone && (
                          <a
                            href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)] transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors" title={t('delete')}>
                              <Trash2 size={15} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-strong rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-heading">{t('confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>{t('confirmDeleteMsg')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOrder(o.id)} className="bg-danger text-primary-foreground hover:bg-danger/90 rounded-xl">
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(o => (
              <Link key={o.id} to={`/orders/${o.id}`} className="block rounded-2xl glass-strong p-4 hover:ring-1 hover:ring-teal/20 transition-all active:scale-[0.98]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold text-sm">{o.client}</h3>
                    {o.phone && <p className="text-[11px] text-muted-foreground mt-0.5">{o.phone}</p>}
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <TransportBadge transport={o.transport} />
                  <span className="text-[11px] text-muted-foreground ml-auto">{o.dateOrder}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading">{t('clientPrice')}</span>
                      <p className="text-sm font-medium tabular-nums">{formatXOF(o.clientPrice)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading">{t('profit')}</span>
                      <p className={`text-sm font-amount tabular-nums ${o.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                        {formatXOF(o.profit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5" onClick={e => e.preventDefault()}>
                    {o.phone && (
                      <a
                        href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl hover:bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)] transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                    )}
                    <Link to={`/orders/${o.id}/edit`} className="p-2 rounded-xl hover:bg-teal/10 hover:text-teal transition-colors">
                      <Pencil size={16} />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 rounded-xl hover:bg-danger/10 hover:text-danger transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-strong rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading">{t('confirmDelete')}</AlertDialogTitle>
                          <AlertDialogDescription>{t('confirmDeleteMsg')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteOrder(o.id)} className="bg-danger text-primary-foreground hover:bg-danger/90 rounded-xl">
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
