interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly }: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i)}
          className={`text-2xl transition-colors ${i <= value ? 'text-gold' : 'text-muted-foreground/30'} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
