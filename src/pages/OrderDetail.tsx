import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import TransportBadge from '@/components/TransportBadge';
import StatusBadge from '@/components/StatusBadge';
import StarRating from '@/components/StarRating';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, t, formatXOF } = useApp();
  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!order) return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground">{t('noOrders')}</p>
      <button onClick={() => navigate('/orders')} className="mt-4 text-teal font-heading">{t('back')}</button>
    </div>
  );

  const rows: [string, React.ReactNode][] = [
    [t('client'), order.client],
    [t('transport'), <TransportBadge key="t" transport={order.transport} />],
    [t('realPrice'), formatXOF(order.realPrice)],
    [t('clientPrice'), formatXOF(order.clientPrice)],
    [t('status'), <StatusBadge key="s" status={order.status} />],
    [t('dateOrder'), order.dateOrder || '—'],
    [t('dateArrival'), order.dateArrival || '—'],
    [t('datePickup'), order.datePickup || '—'],
    [t('dateDelivery'), order.dateDelivery || '—'],
  ];

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground font-heading mb-4">{t('back')}</button>
      <h2 className="text-xl font-heading font-bold uppercase tracking-wider mb-6">{t('orderDetail')}</h2>

      {/* Detail table */}
      <div className="bg-card rounded-lg overflow-hidden border border-border mb-6">
        <div className="bg-nav px-4 py-3">
          <h3 className="font-heading font-bold uppercase text-sm tracking-wider text-nav-foreground">{order.client}</h3>
        </div>
        <div className="divide-y divide-border">
          {rows.map(([label, val]) => (
            <div key={label as string} className="flex items-center justify-between px-4 py-3">
              <span className="text-xs font-heading uppercase text-muted-foreground">{label}</span>
              <span className="text-sm font-medium">{val}</span>
            </div>
          ))}
        </div>
        {/* Total benefit */}
        <div className="bg-nav px-4 py-4 flex items-center justify-between">
          <span className="font-heading font-bold uppercase text-sm tracking-wider text-gold">{t('totalBenefit')}</span>
          <span className={`font-amount text-lg ${order.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
            {formatXOF(order.profit)}
          </span>
        </div>
      </div>

      {/* Photos */}
      {order.photos.length > 0 && (
        <div className="mb-6">
          <h3 className="font-heading font-bold uppercase text-sm tracking-wider text-muted-foreground mb-3">{t('photos')}</h3>
          <div className="flex flex-wrap gap-3">
            {order.photos.map((p, i) => (
              <button key={i} onClick={() => setLightbox(p)} className="w-24 h-24 rounded-lg overflow-hidden border border-border hover:border-teal transition-colors">
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}

      {/* Review */}
      {(order.rating > 0 || order.review || order.suggestions) && (
        <div className="bg-card rounded-lg p-4 border border-border mb-6">
          <h3 className="font-heading font-bold uppercase text-sm tracking-wider text-muted-foreground mb-3">{t('review')}</h3>
          {order.rating > 0 && <StarRating value={order.rating} readonly />}
          {order.review && <p className="text-sm mt-2">{order.review}</p>}
          {order.suggestions && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-xs font-heading uppercase text-muted-foreground">{t('suggestions')}</span>
              <p className="text-sm mt-1">{order.suggestions}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={`/orders/${order.id}/edit`} className="flex-1 h-12 rounded-lg bg-teal text-primary-foreground font-heading font-bold uppercase tracking-wider flex items-center justify-center hover:bg-teal-light transition-colors">
          ✏️ {t('edit')}
        </Link>
        <button onClick={() => navigate(-1)} className="px-6 h-12 rounded-lg border border-border text-muted-foreground font-heading font-bold uppercase tracking-wider hover:text-foreground transition-colors">
          {t('back')}
        </button>
      </div>
    </div>
  );
}
