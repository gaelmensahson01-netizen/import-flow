import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import TransportBadge from '@/components/TransportBadge';
import StatusBadge from '@/components/StatusBadge';
import StarRating from '@/components/StarRating';

function parseWhatsAppReview(text: string) {
  const starCount = (text.match(/⭐️|⭐/g) || []).length;
  const cleaned = text.replace(/⭐️|⭐/g, '').trim();
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  return { rating: Math.min(starCount, 5), review: lines.join('\n') };
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, saveOrder, t, formatXOF } = useApp();
  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');

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
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground font-heading mb-4 transition-colors">{t('back')}</button>
      <h2 className="text-xl font-heading font-bold tracking-wider mb-6">{t('orderDetail')}</h2>

      {/* Detail table */}
      <div className="rounded-xl overflow-hidden glass mb-6">
        <div className="glass-nav px-4 py-3">
          <h3 className="font-heading font-semibold text-sm tracking-wider text-nav-foreground">{order.client}</h3>
        </div>
        <div className="divide-y divide-border/50">
          {rows.map(([label, val]) => (
            <div key={label as string} className="flex items-center justify-between px-4 py-3">
              <span className="text-xs font-heading text-muted-foreground">{label}</span>
              <span className="text-sm font-medium">{val}</span>
            </div>
          ))}
        </div>
        {/* Total benefit */}
        <div className="glass-nav px-4 py-4 flex items-center justify-between">
          <span className="font-heading font-semibold text-sm tracking-wider text-gold">{t('totalBenefit')}</span>
          <span className={`font-amount text-lg ${order.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
            {formatXOF(order.profit)}
          </span>
        </div>
      </div>

      {/* Photos */}
      {order.photos.length > 0 && (
        <div className="mb-6">
          <h3 className="font-heading font-semibold text-sm tracking-wider text-muted-foreground mb-3">{t('photos')}</h3>
          <div className="flex flex-wrap gap-3">
            {order.photos.map((p, i) => (
              <button key={i} onClick={() => setLightbox(p)} className="w-24 h-24 rounded-xl overflow-hidden glass hover:ring-2 hover:ring-teal/50 transition-all">
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}

      {/* Review */}
      {(order.rating > 0 || order.review || order.suggestions) && (
        <div className="rounded-xl glass p-4 mb-6">
          <h3 className="font-heading font-semibold text-sm tracking-wider text-muted-foreground mb-3">{t('review')}</h3>
          {order.rating > 0 && <StarRating value={order.rating} readonly />}
          {order.review && <p className="text-sm mt-2">{order.review}</p>}
          {order.suggestions && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <span className="text-xs font-heading text-muted-foreground">{t('suggestions')}</span>
              <p className="text-sm mt-1">{order.suggestions}</p>
            </div>
          )}
        </div>
      )}

      {/* Paste WhatsApp review */}
      <div className="mb-6">
        {!pasteMode ? (
          <button
            onClick={() => setPasteMode(true)}
            className="w-full h-12 rounded-xl glass text-muted-foreground font-heading font-semibold tracking-wider hover:text-foreground transition-colors"
          >
            📋 {t('pasteReview')}
          </button>
        ) : (
          <div className="rounded-xl glass p-4 space-y-3">
            <h3 className="font-heading font-semibold text-sm tracking-wider text-muted-foreground">{t('pasteReviewHint')}</h3>
            <textarea
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              rows={5}
              className="w-full rounded-lg bg-background/50 border border-border/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={t('pasteReviewPlaceholder')}
              autoFocus
            />
            {pasteText && (() => {
              const parsed = parseWhatsAppReview(pasteText);
              return (
                <div className="rounded-lg bg-background/30 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading text-muted-foreground">{t('rating')} :</span>
                    {parsed.rating > 0 ? <StarRating value={parsed.rating} readonly /> : <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                  <div>
                    <span className="text-xs font-heading text-muted-foreground">{t('review')} :</span>
                    <p className="text-sm mt-1">{parsed.review || '—'}</p>
                  </div>
                </div>
              );
            })()}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const parsed = parseWhatsAppReview(pasteText);
                  saveOrder({ ...order, rating: parsed.rating || order.rating, review: parsed.review || order.review });
                  setPasteMode(false);
                  setPasteText('');
                }}
                disabled={!pasteText.trim()}
                className="flex-1 h-10 rounded-xl bg-teal text-primary-foreground font-heading font-semibold tracking-wider hover:bg-teal-light transition-colors disabled:opacity-50"
              >
                ✅ {t('save')}
              </button>
              <button
                onClick={() => { setPasteMode(false); setPasteText(''); }}
                className="px-4 h-10 rounded-xl glass text-muted-foreground font-heading tracking-wider hover:text-foreground transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp review request */}
      {order.phone && (
        <div className="mb-6">
          <a
            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Bonjour ${order.client}, Merci pour votre commande. Pourriez-vous me donner votre avis et une note de 1 à 5 ⭐ ainsi que d'éventuelles suggestions pour améliorer la qualité de service ? Merci pour votre confiance !`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[hsl(142,70%,45%)] text-primary-foreground font-heading font-semibold tracking-wider hover:bg-[hsl(142,70%,40%)] transition-colors"
          >
            💬 {t('askReview')}
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={`/orders/${order.id}/edit`} className="flex-1 h-12 rounded-xl bg-teal text-primary-foreground font-heading font-semibold tracking-wider flex items-center justify-center hover:bg-teal-light transition-colors">
          ✏️ {t('edit')}
        </Link>
        <button onClick={() => navigate(-1)} className="px-6 h-12 rounded-xl glass text-muted-foreground font-heading font-semibold tracking-wider hover:text-foreground transition-colors">
          {t('back')}
        </button>
      </div>
    </div>
  );
}
