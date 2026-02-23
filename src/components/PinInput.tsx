import { useRef, useState, useCallback } from 'react';

interface Props {
  onComplete: (pin: string) => void;
  error?: boolean;
}

export default function PinInput({ onComplete, error }: Props) {
  const [values, setValues] = useState(['', '', '', '']);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleChange = useCallback((i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (v && i < 3) refs[i + 1].current?.focus();
    if (next.every(d => d.length === 1)) {
      setTimeout(() => onComplete(next.join('')), 100);
    }
  }, [values, onComplete]);

  const handleKeyDown = useCallback((i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  }, [values]);

  return (
    <div className={`flex gap-3 justify-center ${error ? 'animate-shake' : ''}`}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="w-14 h-14 text-center text-2xl font-heading font-bold rounded-lg bg-card border-2 border-border text-card-foreground focus:border-teal focus:outline-none transition-colors"
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}
