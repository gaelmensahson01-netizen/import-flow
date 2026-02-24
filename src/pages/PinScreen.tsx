import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import PinInput from '@/components/PinInput';

export default function PinScreen() {
  const { user, t, validatePin, goToSplash, toggleLang, toggleTheme, theme, lang } = useApp();
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);

  const handlePin = useCallback((pin: string) => {
    if (validatePin(pin)) {
      goToSplash();
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setKey(k => k + 1);
      }, 600);
    }
  }, [validatePin, goToSplash]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-teal/5 blur-[120px] animate-glow pointer-events-none" />

      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={toggleLang} className="text-xs font-heading font-semibold border border-border rounded-md px-2 py-1 text-foreground/60 hover:text-foreground transition-colors">
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <button onClick={toggleTheme} className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>

      <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
        <h1 className="text-teal font-heading text-xs tracking-[0.3em]">✦ Import Tracker ✦</h1>
        <h2 className="text-2xl font-heading font-bold">
          {t('welcome')} <span className="text-teal">{user}</span>, {t('enterPin')}
        </h2>
        <PinInput key={key} onComplete={handlePin} error={error} />
        {error && <p className="text-danger text-sm font-semibold animate-fade-in">{t('wrongPin')}</p>}
      </div>
    </div>
  );
}
