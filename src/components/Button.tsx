'use client';

interface ButtonProps {
  label: string;
  value: string;
  variant: 'number' | 'operator' | 'action' | 'equals';
  onClick: () => void;
}

export default function Button({ label, variant, onClick }: ButtonProps) {
  const baseClasses =
    'flex items-center justify-center rounded-2xl text-xl font-medium h-16 w-full cursor-pointer select-none transition-all duration-100 active:scale-95';

  const variantClasses = {
    number:
      'bg-slate-700 hover:bg-slate-600 text-white shadow-md',
    operator:
      'bg-amber-500 hover:bg-amber-400 text-white shadow-md',
    action:
      'bg-slate-500 hover:bg-slate-400 text-white shadow-md',
    equals:
      'bg-amber-500 hover:bg-amber-400 text-white shadow-md',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}
