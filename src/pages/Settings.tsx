import { useState, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import PinInput from '@/components/PinInput';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function Settings() {
  const { user, reminderDays, autosave, t, updateUser, updatePin, updateReminderDays, setAutosave, exportJson, importJson, resetAll } = useApp();

  const [name, setName] = useState(user);
  const [pinMode, setPinMode] = useState<'idle' | 'old' | 'new' | 'confirm'>('idle');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [days, setDays] = useState(reminderDays);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleNameSave = () => {
    if (name.trim()) {
      updateUser(name.trim());
      toast.success(t('nameChanged'));
    }
  };

  const handleOldPin = (pin: string) => {
    setOldPin(pin);
    setPinMode('new');
  };

  const handleNewPin = (pin: string) => {
    setNewPin(pin);
    setPinMode('confirm');
  };

  const handleConfirmPin = (pin: string) => {
    if (pin !== newPin) {
      setPinError(t('pinMismatch'));
      setPinMode('new');
      setNewPin('');
      setTimeout(() => setPinError(''), 2000);
      return;
    }
    if (updatePin(oldPin, pin)) {
      toast.success(t('pinChanged'));
      setPinMode('idle');
      setOldPin('');
      setNewPin('');
    } else {
      setPinError(t('pinWrong'));
      setPinMode('old');
      setOldPin('');
      setNewPin('');
      setTimeout(() => setPinError(''), 2000);
    }
  };

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (importJson(reader.result as string)) {
        toast.success(t('imported'));
      }
    };
    reader.readAsText(file);
  }, [importJson, t]);

  const inputClass = "w-full h-10 px-3 rounded-xl glass text-foreground text-sm focus:ring-2 focus:ring-teal/50 focus:outline-none transition-all";

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="glass rounded-xl px-4 py-2.5 mb-4 mt-6 border-l-2 border-teal">
      <h3 className="font-heading font-semibold text-sm tracking-wider text-teal">{label}</h3>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto animate-fade-in">
      <h2 className="text-xl font-heading font-bold tracking-wider mb-2">{t('settings')}</h2>

      {/* Profile */}
      <SectionHeader label={t('profile')} />
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-heading text-muted-foreground mb-1">{t('changeName')}</label>
          <div className="flex gap-2">
            <input value={name} onChange={e => setName(e.target.value)} className={`flex-1 ${inputClass}`} />
            <button onClick={handleNameSave} className="px-4 h-10 rounded-xl bg-teal text-primary-foreground text-sm font-heading font-semibold transition-colors hover:bg-teal-light">OK</button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading text-muted-foreground mb-1">{t('changePin')}</label>
          {pinMode === 'idle' ? (
            <button onClick={() => setPinMode('old')} className="h-10 px-4 rounded-xl glass text-sm font-heading hover:ring-2 hover:ring-teal/50 transition-all">
              {t('changePin')}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {pinMode === 'old' ? t('oldPin') : pinMode === 'new' ? t('newPin') : t('confirmPin')}
              </p>
              <PinInput
                key={pinMode}
                onComplete={pinMode === 'old' ? handleOldPin : pinMode === 'new' ? handleNewPin : handleConfirmPin}
                error={!!pinError}
              />
              {pinError && <p className="text-danger text-xs">{pinError}</p>}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-heading text-muted-foreground mb-1">{t('changeReminder')}</label>
          <div className="flex gap-2">
            <input type="number" value={days} min={1} onChange={e => setDays(parseInt(e.target.value) || 1)}
              className={`w-24 text-center ${inputClass}`} />
            <button onClick={() => updateReminderDays(days)} className="px-4 h-10 rounded-xl bg-teal text-primary-foreground text-sm font-heading font-semibold transition-colors hover:bg-teal-light">OK</button>
          </div>
        </div>
      </div>

      {/* Export / Import */}
      <SectionHeader label={t('exportData')} />
      <div className="space-y-3">
        <button onClick={exportJson} className="w-full h-10 rounded-xl glass text-sm font-heading font-semibold hover:ring-2 hover:ring-teal/50 transition-all">
          {t('exportJson')}
        </button>
      </div>

      <SectionHeader label={t('importData')} />
      <div className="space-y-3">
        <button onClick={() => fileRef.current?.click()} className="w-full h-10 rounded-xl glass text-sm font-heading font-semibold hover:ring-2 hover:ring-teal/50 transition-all">
          {t('importJson')}
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      {/* Auto-save */}
      <div className="mt-6 flex items-center justify-between p-4 rounded-xl glass">
        <span className="text-sm font-heading font-semibold">{t('autosave')}</span>
        <button
          onClick={() => setAutosave(!autosave)}
          className={`w-12 h-6 rounded-full relative transition-colors ${autosave ? 'bg-teal' : 'bg-muted'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${autosave ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Danger zone */}
      <SectionHeader label={t('dangerZone')} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full h-12 rounded-xl border border-danger text-danger font-heading font-semibold tracking-wider hover:bg-danger hover:text-primary-foreground transition-colors">
            {t('resetAll')}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="glass-strong rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('resetAll')}</AlertDialogTitle>
            <AlertDialogDescription>{t('resetConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={resetAll} className="bg-danger text-primary-foreground hover:bg-danger/90">
              {t('yes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
