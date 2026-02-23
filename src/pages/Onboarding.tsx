import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PinInput from '@/components/PinInput';

export default function Onboarding() {
  const { t, toggleLang, toggleTheme, theme, lang, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState(false);
  const [days, setDays] = useState(3);
  const [pinStep, setPinStep] = useState<'create' | 'confirm'>('create');

  const handlePinCreate = (p: string) => {
    setPin(p);
    setPinStep('confirm');
  };

  const handlePinConfirm = (p: string) => {
    if (p === pin) {
      setPinConfirm(p);
      setStep(2);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 600);
      setPinStep('create');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={toggleLang} className="text-xs font-heading font-bold uppercase border border-border rounded px-2 py-1 text-foreground/70 hover:text-foreground">
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <button onClick={toggleTheme} className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <h1 className="text-teal font-heading text-xs uppercase tracking-[0.3em] text-center mb-8">✦ Import Tracker ✦</h1>

        {step === 0 && (
          <div className="space-y-6 animate-fade-in" key="step0">
            <h2 className="text-2xl font-heading font-bold text-center">{t('onboardingName')}</h2>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-card border border-border text-card-foreground font-body text-lg focus:border-teal focus:outline-none"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
            />
            <button
              disabled={!name.trim()}
              onClick={() => setStep(1)}
              className="w-full h-12 rounded-lg bg-teal text-primary-foreground font-heading font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-teal-light transition-colors"
            >
              {t('continue')}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in" key="step1">
            <h2 className="text-2xl font-heading font-bold text-center">
              {pinStep === 'create' ? t('onboardingPin') : t('onboardingPinConfirm')}
            </h2>
            <PinInput
              key={pinStep}
              onComplete={pinStep === 'create' ? handlePinCreate : handlePinConfirm}
              error={pinError}
            />
            {pinError && <p className="text-center text-danger text-sm">{t('pinMismatch')}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in" key="step2">
            <h2 className="text-2xl font-heading font-bold text-center">{t('onboardingReminder')}</h2>
            <input
              type="number"
              value={days}
              onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-12 px-4 rounded-lg bg-card border border-border text-card-foreground font-body text-lg text-center focus:border-teal focus:outline-none"
              min={1}
            />
            <button
              onClick={() => completeOnboarding(name.trim(), pinConfirm, days)}
              className="w-full h-12 rounded-lg bg-teal text-primary-foreground font-heading font-bold uppercase tracking-wider hover:bg-teal-light transition-colors"
            >
              {t('continue')}
            </button>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === step ? 'bg-teal' : 'bg-border'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
