import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import StarRating from '@/components/StarRating';
import type { Order } from '@/lib/types';

export default function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, saveOrder, t } = useApp();

  const existing = useMemo(() => id ? orders.find(o => o.id === id) : null, [id, orders]);
  const isEdit = !!existing;

  const [form, setForm] = useState<Omit<Order, 'id' | 'createdAt'>>(() => existing ? {
    client: existing.client, transport: existing.transport,
    realPrice: existing.realPrice, clientPrice: existing.clientPrice, profit: existing.profit,
    dateOrder: existing.dateOrder, dateArrival: existing.dateArrival,
    datePickup: existing.datePickup, dateDelivery: existing.dateDelivery,
    status: existing.status, photos: existing.photos,
    rating: existing.rating, review: existing.review, suggestions: existing.suggestions,
  } : {
    client: '', transport: 'avion', realPrice: 0, clientPrice: 0, profit: 0,
    dateOrder: new Date().toISOString().split('T')[0], dateArrival: '', datePickup: '', dateDelivery: '',
    status: 'encours', photos: [], rating: 0, review: '', suggestions: '',
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [photoWarning, setPhotoWarning] = useState(false);

  const set = useCallback(<K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'realPrice' || key === 'clientPrice') {
        next.profit = (next.clientPrice || 0) - (next.realPrice || 0);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const totalSize = form.photos.reduce((s, p) => s + p.length, 0);
    setPhotoWarning(totalSize > 2_000_000);
  }, [form.photos]);

  const handlePhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => set('photos', [...form.photos, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }, [form.photos, set]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handlePhotos(e.dataTransfer.files);
  }, [handlePhotos]);

  const removePhoto = useCallback((i: number) => {
    set('photos', form.photos.filter((_, idx) => idx !== i));
  }, [form.photos, set]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client.trim()) return;
    const order: Order = {
      ...form,
      id: existing?.id || String(Date.now()),
      createdAt: existing?.createdAt || Date.now(),
    };
    saveOrder(order);
    navigate('/orders');
  };

  const inputClass = "w-full h-10 px-3 rounded-xl glass text-foreground text-sm focus:ring-2 focus:ring-teal/50 focus:outline-none transition-all";

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="glass rounded-xl px-4 py-2.5 mb-4 border-l-2 border-teal">
      <h3 className="font-heading font-semibold text-sm tracking-wider text-teal">{label}</h3>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground font-heading mb-4 transition-colors">{t('back')}</button>
      <h2 className="text-xl font-heading font-bold tracking-wider mb-6">{isEdit ? t('editOrder') : t('newOrder')}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client info */}
        <section>
          <SectionHeader label={t('clientInfo')} />
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('client')}</label>
              <input value={form.client} onChange={e => set('client', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('transport')}</label>
              <select value={form.transport} onChange={e => set('transport', e.target.value as any)} className={inputClass}>
                <option value="avion">{t('avion')}</option>
                <option value="bateau">{t('bateau')}</option>
                <option value="mix">{t('mix')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Prices */}
        <section>
          <SectionHeader label={t('priceInfo')} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('realPrice')}</label>
              <input type="number" value={form.realPrice || ''} onChange={e => set('realPrice', Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('clientPrice')}</label>
              <input type="number" value={form.clientPrice || ''} onChange={e => set('clientPrice', Number(e.target.value))} className={inputClass} />
            </div>
          </div>
          <div className="mt-3 p-3 rounded-xl glass">
            <span className="text-xs font-heading text-muted-foreground">{t('profit')}: </span>
            <span className={`font-amount ${form.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
              {new Intl.NumberFormat('fr-FR').format(form.profit)} XOF
            </span>
          </div>
        </section>

        {/* Dates */}
        <section>
          <SectionHeader label={t('dates')} />
          <div className="grid grid-cols-2 gap-4">
            {(['dateOrder','dateArrival','datePickup','dateDelivery'] as const).map(key => (
              <div key={key}>
                <label className="block text-xs font-heading text-muted-foreground mb-1">{t(key)}</label>
                <input type="date" value={form[key]} onChange={e => set(key, e.target.value)} className={inputClass} />
              </div>
            ))}
          </div>
        </section>

        {/* Status */}
        <section>
          <SectionHeader label={t('statusSection')} />
          <select value={form.status} onChange={e => set('status', e.target.value as any)} className={inputClass}>
            {['encours','arrive','recupere','livre'].map(s => (
              <option key={s} value={s}>{t(s as any)}</option>
            ))}
          </select>
        </section>

        {/* Photos */}
        <section>
          <SectionHeader label={t('photosSection')} />
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-border rounded-xl p-6 text-center cursor-pointer glass hover:border-teal/50 transition-colors"
          >
            <p className="text-muted-foreground text-sm">{t('dragDrop')}</p>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handlePhotos(e.target.files)} />
          </div>
          {photoWarning && <p className="text-danger text-xs mt-2">{t('photoWarning')}</p>}
          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.photos.map((p, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden glass">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-danger text-primary-foreground text-xs flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Review */}
        <section>
          <SectionHeader label={t('reviewSection')} />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('rating')}</label>
              <StarRating value={form.rating} onChange={v => set('rating', v)} />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('review')}</label>
              <textarea value={form.review} onChange={e => set('review', e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-xl glass text-foreground text-sm focus:ring-2 focus:ring-teal/50 focus:outline-none resize-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1">{t('suggestions')}</label>
              <textarea value={form.suggestions} onChange={e => set('suggestions', e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-xl glass text-foreground text-sm focus:ring-2 focus:ring-teal/50 focus:outline-none resize-none transition-all" />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 h-12 rounded-xl bg-teal text-primary-foreground font-heading font-semibold tracking-wider hover:bg-teal-light transition-colors">
            {t('save')}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 h-12 rounded-xl border border-danger text-danger font-heading font-semibold tracking-wider hover:bg-danger hover:text-primary-foreground transition-colors">
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
