'use client';

interface DisplayProps {
  currentValue: string;
  expression: string;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export default function Display({ currentValue, expression, saveStatus }: DisplayProps) {
  const formatNumber = (val: string) => {
    if (val === 'Error') return 'Error';
    if (val.length > 12) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        return num.toExponential(4);
      }
    }
    return val;
  };

  const getFontSize = (val: string) => {
    const len = val.length;
    if (len <= 6) return 'text-5xl';
    if (len <= 9) return 'text-4xl';
    if (len <= 12) return 'text-3xl';
    return 'text-2xl';
  };

  return (
    <div className="bg-slate-900 px-6 py-6 min-h-[130px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="text-slate-500 text-sm font-mono h-5 overflow-hidden">
          {expression || '\u00A0'}
        </div>
        <div className="text-xs">
          {saveStatus === 'saving' && (
            <span className="text-yellow-400">saving...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-green-400">✓ saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-400">save failed</span>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <span
          className={`font-light text-white font-mono tracking-tight transition-all ${
            currentValue === 'Error' ? 'text-red-400 text-4xl' : getFontSize(currentValue)
          }`}
        >
          {formatNumber(currentValue)}
        </span>
      </div>
    </div>
  );
}
