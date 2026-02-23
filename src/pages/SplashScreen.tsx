import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function SplashScreen() {
  const { user, t, enterApp, toggleLang, toggleTheme, theme, lang } = useApp();
  const [opening, setOpening] = useState(false);

  const handleEnter = () => {
    setOpening(true);
    setTimeout(enterApp, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Two panels */}
      <div className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-b from-background to-card ${opening ? 'animate-panel-left' : ''}`} />
      <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-background to-card ${opening ? 'animate-panel-right' : ''}`} />

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${opening ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={toggleLang} className="text-xs font-heading font-bold uppercase border border-border rounded px-2 py-1 text-foreground/70 hover:text-foreground">
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button onClick={toggleTheme} className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</button>
        </div>

        <p className="text-teal font-heading text-xs uppercase tracking-[0.3em] mb-6 animate-fade-in">{t('tagline')}</p>
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-center mb-2 animate-fade-in">
          {t('splashWelcome')}
        </h1>
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-center mb-6 animate-fade-in">
          Import Tracker <span className="text-teal">{user}</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 animate-fade-in">{t('splashSubtitle')}</p>
        <button
          onClick={handleEnter}
          className="px-10 py-3 border-2 border-teal text-teal font-heading font-bold uppercase tracking-widest rounded-lg hover:bg-teal hover:text-primary-foreground transition-all duration-300 animate-scale-in"
        >
          {t('enter')}
        </button>
      </div>
    </div>
  );
}
