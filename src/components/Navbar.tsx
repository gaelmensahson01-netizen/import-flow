import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { user, lang, toggleTheme, toggleLang, theme, undo, redo, canUndo, canRedo, alertOrders, t } = useApp();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: t('dashboard') },
    { to: '/orders', label: t('orders'), badge: alertOrders.length },
    { to: '/settings', label: t('settings') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-14 glass-nav flex items-center px-4 gap-2">
      <Link to="/" className="font-heading text-xl font-bold text-teal tracking-wider mr-4">IT</Link>

      <div className="hidden sm:flex items-center gap-1">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-heading font-semibold tracking-wide transition-all ${
              pathname === l.to ? 'glass text-gold' : 'text-nav-foreground/70 hover:text-nav-foreground hover:bg-nav-foreground/5'
            }`}
          >
            {l.label}
            {l.badge ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-[10px] text-nav-foreground flex items-center justify-center font-bold">
                {l.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="flex-1" />

      <button onClick={undo} disabled={!canUndo} className="text-nav-foreground/60 hover:text-nav-foreground disabled:opacity-20 text-lg transition-colors" title="Undo">↩</button>
      <button onClick={redo} disabled={!canRedo} className="text-nav-foreground/60 hover:text-nav-foreground disabled:opacity-20 text-lg transition-colors" title="Redo">↪</button>
      <button onClick={toggleTheme} className="text-nav-foreground/60 hover:text-nav-foreground text-lg ml-1 transition-colors">{theme === 'dark' ? '☀️' : '🌙'}</button>
      <button onClick={toggleLang} className="text-nav-foreground/60 hover:text-nav-foreground text-xs font-heading font-semibold border border-nav-foreground/15 rounded-md px-2 py-0.5 ml-1 transition-colors hover:border-nav-foreground/30">
        {lang === 'fr' ? 'EN' : 'FR'}
      </button>
      <span className="ml-2 px-3 py-1 rounded-full glass text-teal text-xs font-heading font-bold">{user}</span>

      {/* Mobile nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 glass-nav flex justify-around py-2.5">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`relative flex flex-col items-center text-xs font-heading font-semibold ${
              pathname === l.to ? 'text-gold' : 'text-nav-foreground/50'
            }`}
          >
            {l.label}
            {l.badge ? (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-danger text-[10px] text-nav-foreground flex items-center justify-center font-bold">
                {l.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </nav>
  );
}
