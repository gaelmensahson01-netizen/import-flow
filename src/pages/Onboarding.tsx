import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import PinInput from '@/components/PinInput';

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

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

      <div className="w-full max-w-md">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-teal font-heading text-xs uppercase tracking-[0.3em] text-center mb-8"
        >
          ✦ Import Tracker ✦
        </motion.h1>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-heading font-bold text-center">{t('onboardingName')}</h2>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-card border border-border text-card-foreground font-body text-lg focus:border-teal focus:outline-none"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
              />
              <motion.button
                disabled={!name.trim()}
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-lg bg-teal text-primary-foreground font-heading font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-teal-light transition-colors"
              >
                {t('continue')}
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-heading font-bold text-center">
                {pinStep === 'create' ? t('onboardingPin') : t('onboardingPinConfirm')}
              </h2>
              <PinInput
                key={pinStep}
                onComplete={pinStep === 'create' ? handlePinCreate : handlePinConfirm}
                error={pinError}
              />
              {pinError && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-danger text-sm"
                >
                  {t('pinMismatch')}
                </motion.p>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-heading font-bold text-center">{t('onboardingReminder')}</h2>
              <input
                type="number"
                value={days}
                onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-12 px-4 rounded-lg bg-card border border-border text-card-foreground font-body text-lg text-center focus:border-teal focus:outline-none"
                min={1}
              />
              <motion.button
                onClick={() => completeOnboarding(name.trim(), pinConfirm, days)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-lg bg-teal text-primary-foreground font-heading font-bold uppercase tracking-wider hover:bg-teal-light transition-colors"
              >
                {t('continue')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: i === step ? 1.3 : 1, backgroundColor: i === step ? 'hsl(180 52% 35%)' : 'hsl(var(--border))' }}
              transition={{ duration: 0.3 }}
              className="w-2.5 h-2.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
