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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={toggleLang} className="text-xs font-heading font-bold uppercase border border-border rounded px-2 py-1 text-foreground/70 hover:text-foreground">
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <button onClick={toggleTheme} className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>

      <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
        <h1 className="text-teal font-heading text-xs uppercase tracking-[0.3em]">✦ Import Tracker ✦</h1>
        <h2 className="text-2xl font-heading font-bold">
          {t('welcome')} <span className="text-teal">{user}</span>, {t('enterPin')}
        </h2>
        <PinInput key={key} onComplete={handlePin} error={error} />
        {error && <p className="text-danger text-sm font-bold animate-fade-in">{t('wrongPin')}</p>}
      </div>
    </div>
  );
}
