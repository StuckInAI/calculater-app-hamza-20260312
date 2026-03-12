'use client';

import { useEffect, useState } from 'react';

interface Calculation {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/calculations');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setCalculations(data);
    } catch (err) {
      setError('Failed to load calculation history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    try {
      setClearing(true);
      const response = await fetch('/api/calculations', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to clear history');
      setCalculations([]);
    } catch (err) {
      setError('Failed to clear history.');
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Calculation History</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={clearHistory}
            disabled={clearing || calculations.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-slate-400 mt-3">Loading history...</p>
        </div>
      ) : calculations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No calculations yet.</p>
          <p className="text-slate-500 text-sm mt-1">
            Use the calculator to perform some operations!
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to Calculator
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:bg-slate-750 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-slate-400 text-sm">{calc.expression}</span>
                <span className="text-white font-bold text-xl">= {calc.result}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-xs">{formatDate(calc.createdAt)}</span>
                <div className="text-slate-600 text-xs mt-1">#{calc.id}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
