import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const { user, t, enterApp, toggleLang, toggleTheme, theme, lang } = useApp();
  const [opening, setOpening] = useState(false);

  const handleEnter = () => {
    setOpening(true);
    setTimeout(enterApp, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Two panels */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-b from-background to-card"
        animate={opening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-background to-card"
        animate={opening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
      />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center p-6"
        animate={opening ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={toggleLang} className="text-xs font-heading font-bold uppercase border border-border rounded px-2 py-1 text-foreground/70 hover:text-foreground">
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button onClick={toggleTheme} className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-teal font-heading text-xs uppercase tracking-[0.3em] mb-6"
        >
          {t('tagline')}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-3xl md:text-5xl font-heading font-extrabold text-center mb-2"
        >
          {t('splashWelcome')}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl md:text-5xl font-heading font-extrabold text-center mb-6"
        >
          Import Tracker <span className="text-teal">{user}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-muted-foreground text-lg mb-10"
        >
          {t('splashSubtitle')}
        </motion.p>
        <motion.button
          onClick={handleEnter}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06, backgroundColor: 'hsl(180 52% 35%)', color: '#fff' }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-3 border-2 border-teal text-teal font-heading font-bold uppercase tracking-widest rounded-lg transition-all duration-300"
        >
          {t('enter')}
        </motion.button>
      </motion.div>
    </div>
  );
}
