import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Order, Lang, Theme, Screen } from '@/lib/types';
import labels, { type LabelKey } from '@/lib/i18n';

interface AppCtx {
  screen: Screen;
  user: string;
  lang: Lang;
  theme: Theme;
  reminderDays: number;
  autosave: boolean;
  orders: Order[];
  canUndo: boolean;
  canRedo: boolean;
  alertOrders: Order[];
  completeOnboarding: (name: string, pin: string, days: number) => void;
  validatePin: (pin: string) => boolean;
  enterApp: () => void;
  goToSplash: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  saveOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  updateUser: (name: string) => void;
  updatePin: (oldPin: string, newPin: string) => boolean;
  updateReminderDays: (days: number) => void;
  setAutosave: (v: boolean) => void;
  exportJson: () => void;
  importJson: (text: string) => boolean;
  resetAll: () => void;
  undo: () => void;
  redo: () => void;
  t: (key: LabelKey) => string;
  formatXOF: (n: number) => string;
}

const Ctx = createContext<AppCtx>(null!);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>(() =>
    !localStorage.getItem('it_user') ? 'onboarding' : 'pin'
  );
  const [user, setUser] = useState(() => localStorage.getItem('it_user') || '');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('it_lang') as Lang) || 'fr');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('it_theme') as Theme) || 'dark');
  const [reminderDays, setReminderDays] = useState(() => parseInt(localStorage.getItem('it_reminder_days') || '3'));
  const [autosave, setAutosaveState] = useState(() => localStorage.getItem('it_autosave') !== 'false');
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem('it_orders') || '[]'); } catch { return []; }
  });

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Sync theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('it_theme', theme);
  }, [theme]);

  // Persist orders
  const persistOrders = useCallback((o: Order[]) => {
    localStorage.setItem('it_orders', JSON.stringify(o));
  }, []);

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-49), JSON.stringify(orders)]);
    setRedoStack([]);
  }, [orders]);

  const triggerAutoSave = useCallback((data: Order[]) => {
    if (localStorage.getItem('it_autosave') === 'false') return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const completeOnboarding = useCallback((name: string, pin: string, days: number) => {
    localStorage.setItem('it_user', name);
    localStorage.setItem('it_pin', btoa(pin));
    localStorage.setItem('it_reminder_days', String(days));
    localStorage.setItem('it_lang', lang);
    setUser(name);
    setReminderDays(days);
    setScreen('splash');
  }, [lang]);

  const validatePin = useCallback((pin: string) => {
    return btoa(pin) === localStorage.getItem('it_pin');
  }, []);

  const goToSplash = useCallback(() => setScreen('splash'), []);
  const enterApp = useCallback(() => setScreen('app'), []);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  const toggleLang = useCallback(() => {
    setLang(l => {
      const next = l === 'fr' ? 'en' : 'fr';
      localStorage.setItem('it_lang', next);
      return next;
    });
  }, []);

  const saveOrder = useCallback((order: Order) => {
    pushUndo();
    setOrders(prev => {
      const idx = prev.findIndex(o => o.id === order.id);
      const next = idx >= 0 ? prev.map(o => o.id === order.id ? order : o) : [...prev, order];
      persistOrders(next);
      triggerAutoSave(next);
      return next;
    });
  }, [pushUndo, persistOrders, triggerAutoSave]);

  const deleteOrder = useCallback((id: string) => {
    pushUndo();
    setOrders(prev => {
      const next = prev.filter(o => o.id !== id);
      persistOrders(next);
      return next;
    });
  }, [pushUndo, persistOrders]);

  const updateUser = useCallback((name: string) => {
    localStorage.setItem('it_user', name);
    setUser(name);
  }, []);

  const updatePin = useCallback((oldPin: string, newPin: string) => {
    if (btoa(oldPin) !== localStorage.getItem('it_pin')) return false;
    localStorage.setItem('it_pin', btoa(newPin));
    return true;
  }, []);

  const updateReminderDays = useCallback((days: number) => {
    localStorage.setItem('it_reminder_days', String(days));
    setReminderDays(days);
  }, []);

  const setAutosave = useCallback((v: boolean) => {
    localStorage.setItem('it_autosave', String(v));
    setAutosaveState(v);
  }, []);

  const exportJson = useCallback(() => {
    const data = {
      user, orders,
      settings: { lang, theme, reminderDays, autosave },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [user, orders, lang, theme, reminderDays, autosave]);

  const importJson = useCallback((text: string) => {
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        pushUndo();
        setOrders(data);
        persistOrders(data);
      } else if (data.orders) {
        pushUndo();
        setOrders(data.orders);
        persistOrders(data.orders);
      } else return false;
      return true;
    } catch { return false; }
  }, [pushUndo, persistOrders]);

  const resetAll = useCallback(() => {
    ['it_user','it_pin','it_lang','it_theme','it_reminder_days','it_autosave','it_orders'].forEach(k => localStorage.removeItem(k));
    setScreen('onboarding');
    setOrders([]);
    setUser('');
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, JSON.stringify(orders)]);
    setUndoStack(u => u.slice(0, -1));
    const restored = JSON.parse(prev);
    setOrders(restored);
    persistOrders(restored);
  }, [undoStack, orders, persistOrders]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, JSON.stringify(orders)]);
    setRedoStack(r => r.slice(0, -1));
    const restored = JSON.parse(next);
    setOrders(restored);
    persistOrders(restored);
  }, [redoStack, orders, persistOrders]);

  const t = useCallback((key: LabelKey) => labels[lang][key] || key, [lang]);
  const formatXOF = useCallback((n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF', []);

  const alertOrders = useMemo(() => {
    const now = Date.now();
    return orders.filter(o => {
      if (o.status !== 'arrive' || !o.dateArrival) return false;
      const diff = Math.floor((now - new Date(o.dateArrival).getTime()) / 86400000);
      return diff > reminderDays;
    });
  }, [orders, reminderDays]);

  const value: AppCtx = {
    screen, user, lang, theme, reminderDays, autosave, orders,
    canUndo: undoStack.length > 0, canRedo: redoStack.length > 0,
    alertOrders, completeOnboarding, validatePin, enterApp, goToSplash,
    toggleTheme, toggleLang, saveOrder, deleteOrder,
    updateUser, updatePin, updateReminderDays, setAutosave,
    exportJson, importJson, resetAll, undo, redo, t, formatXOF,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
