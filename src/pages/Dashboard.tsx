import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import TransportBadge from '@/components/TransportBadge';
import StatusBadge from '@/components/StatusBadge';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function Dashboard() {
  const { orders, alertOrders, reminderDays, t, formatXOF, lang } = useApp();

  const totalProfit = useMemo(() => orders.reduce((s, o) => s + o.profit, 0), [orders]);
  const monthProfit = useMemo(() => {
    const key = new Date().toISOString().substring(0, 7);
    return orders.filter(o => o.dateOrder?.startsWith(key)).reduce((s, o) => s + o.profit, 0);
  }, [orders]);
  const toPickup = useMemo(() => orders.filter(o => o.status === 'arrive').length, [orders]);

  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const profit = orders.filter(o => o.dateOrder?.startsWith(key)).reduce((s, o) => s + o.profit, 0);
      return { month: d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }), profit };
    });
  }, [orders, lang]);

  const recent = useMemo(() => [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5), [orders]);

  const stats = [
    { label: t('totalOrders'), value: String(orders.length), accent: 'from-teal to-teal-light' },
    { label: t('totalProfit'), value: formatXOF(totalProfit), accent: 'from-success to-teal', profit: totalProfit },
    { label: t('thisMonth'), value: formatXOF(monthProfit), accent: 'from-gold to-gold', profit: monthProfit },
    { label: t('toPickup'), value: String(toPickup), accent: toPickup > 0 ? 'from-danger to-danger' : 'from-success to-success' },
  ];

  return (
    <motion.div
      className="p-4 md:p-6 space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Alert banner */}
      {alertOrders.length > 0 && (
        <motion.div variants={fadeUp}>
          <Link to="/orders?status=arrive" className="block p-4 rounded-xl glass border-gold/20 hover:border-gold/40 transition-colors">
            <p className="font-heading font-semibold text-gold">
              🔔 {alertOrders.length} {t('reminder')} {reminderDays} {t('reminderSuffix')}
            </p>
          </Link>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-xl glass p-4"
          >
            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${s.accent}`} />
            <p className="text-xs font-heading tracking-wider text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-xl font-heading font-bold ${s.profit !== undefined ? (s.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative') : ''}`}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div variants={fadeUp} className="rounded-xl glass p-5">
        <h3 className="font-heading font-semibold text-sm tracking-wider text-muted-foreground mb-4">{t('profitChart')}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12, fontFamily: 'Satoshi' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="profit" radius={[8, 8, 0, 0]} animationDuration={800} animationEasing="ease-out">
              {chartData.map((_, i) => (
                <Cell key={i} fill="hsl(170 60% 40%)" fillOpacity={0.8} />
              ))}
              <LabelList dataKey="profit" position="top" formatter={(v: number) => v > 0 ? formatXOF(v) : ''} style={{ fill: 'hsl(170 60% 40%)', fontSize: 10, fontFamily: 'Satoshi', fontWeight: 700 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent orders */}
      <motion.div variants={fadeUp} className="rounded-xl glass p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm tracking-wider text-muted-foreground">{t('recentOrders')}</h3>
          <Link to="/orders" className="text-teal text-sm font-heading font-semibold hover:text-teal-light transition-colors">{t('orders')} →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('noOrders')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-heading text-xs text-muted-foreground">{t('client')}</th>
                  <th className="text-left py-2 font-heading text-xs text-muted-foreground">{t('transport')}</th>
                  <th className="text-right py-2 font-heading text-xs text-muted-foreground">{t('profit')}</th>
                  <th className="text-left py-2 font-heading text-xs text-muted-foreground">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(o => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-2.5">
                      <Link to={`/orders/${o.id}`} className="text-foreground hover:text-teal font-medium transition-colors">{o.client}</Link>
                    </td>
                    <td className="py-2.5"><TransportBadge transport={o.transport} /></td>
                    <td className={`py-2.5 text-right font-amount ${o.profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                      {formatXOF(o.profit)}
                    </td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
