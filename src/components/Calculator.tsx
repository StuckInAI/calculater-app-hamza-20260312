'use client';

import { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';

type ButtonValue =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '+' | '-' | '*' | '/'
  | '.' | '=' | 'C' | '±' | '%';

interface CalcState {
  currentValue: string;
  previousValue: string;
  operator: string | null;
  waitingForOperand: boolean;
  expression: string;
}

const initialState: CalcState = {
  currentValue: '0',
  previousValue: '',
  operator: null,
  waitingForOperand: false,
  expression: '',
};

export default function Calculator() {
  const [state, setState] = useState<CalcState>(initialState);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const saveCalculation = async (expression: string, result: string) => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const calculate = (prev: string, curr: string, op: string): string => {
    const a = parseFloat(prev);
    const b = parseFloat(curr);
    if (isNaN(a) || isNaN(b)) return curr;
    switch (op) {
      case '+':
        return String(a + b);
      case '-':
        return String(a - b);
      case '*':
        return String(a * b);
      case '/':
        if (b === 0) return 'Error';
        return String(a / b);
      default:
        return curr;
    }
  };

  const handleButton = useCallback(
    (value: ButtonValue) => {
      setState((prev) => {
        switch (value) {
          case 'C': {
            return { ...initialState };
          }

          case '±': {
            const toggled = String(parseFloat(prev.currentValue) * -1);
            return { ...prev, currentValue: toggled };
          }

          case '%': {
            const pct = String(parseFloat(prev.currentValue) / 100);
            return { ...prev, currentValue: pct };
          }

          case '.': {
            if (prev.waitingForOperand) {
              return { ...prev, currentValue: '0.', waitingForOperand: false };
            }
            if (prev.currentValue.includes('.')) return prev;
            return { ...prev, currentValue: prev.currentValue + '.' };
          }

          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9': {
            if (prev.waitingForOperand) {
              return {
                ...prev,
                currentValue: value,
                waitingForOperand: false,
              };
            }
            const newVal =
              prev.currentValue === '0' ? value : prev.currentValue + value;
            return { ...prev, currentValue: newVal };
          }

          case '+':
          case '-':
          case '*':
          case '/': {
            if (prev.operator && !prev.waitingForOperand) {
              const result = calculate(
                prev.previousValue,
                prev.currentValue,
                prev.operator
              );
              const opSymbol = value === '*' ? '×' : value === '/' ? '÷' : value;
              return {
                ...prev,
                currentValue: result,
                previousValue: result,
                operator: value,
                waitingForOperand: true,
                expression: result + ' ' + opSymbol,
              };
            }
            const opSymbol = value === '*' ? '×' : value === '/' ? '÷' : value;
            return {
              ...prev,
              previousValue: prev.currentValue,
              operator: value,
              waitingForOperand: true,
              expression: prev.currentValue + ' ' + opSymbol,
            };
          }

          case '=': {
            if (!prev.operator || prev.waitingForOperand) return prev;
            const result = calculate(
              prev.previousValue,
              prev.currentValue,
              prev.operator
            );
            const opSymbol =
              prev.operator === '*'
                ? '×'
                : prev.operator === '/'
                ? '÷'
                : prev.operator;
            const fullExpression = `${prev.previousValue} ${opSymbol} ${prev.currentValue}`;

            // Save to database (side effect outside setState)
            setTimeout(() => saveCalculation(fullExpression, result), 0);

            return {
              currentValue: result,
              previousValue: '',
              operator: null,
              waitingForOperand: true,
              expression: `${fullExpression} =`,
            };
          }

          default:
            return prev;
        }
      });
    },
    []
  );

  const buttons: { value: ButtonValue; label: string; variant: 'number' | 'operator' | 'action' | 'equals' }[] = [
    { value: 'C', label: 'C', variant: 'action' },
    { value: '±', label: '±', variant: 'action' },
    { value: '%', label: '%', variant: 'action' },
    { value: '/', label: '÷', variant: 'operator' },
    { value: '7', label: '7', variant: 'number' },
    { value: '8', label: '8', variant: 'number' },
    { value: '9', label: '9', variant: 'number' },
    { value: '*', label: '×', variant: 'operator' },
    { value: '4', label: '4', variant: 'number' },
    { value: '5', label: '5', variant: 'number' },
    { value: '6', label: '6', variant: 'number' },
    { value: '-', label: '−', variant: 'operator' },
    { value: '1', label: '1', variant: 'number' },
    { value: '2', label: '2', variant: 'number' },
    { value: '3', label: '3', variant: 'number' },
    { value: '+', label: '+', variant: 'operator' },
    { value: '0', label: '0', variant: 'number' },
    { value: '.', label: '.', variant: 'number' },
    { value: '=', label: '=', variant: 'equals' },
  ];

  return (
    <div className="w-full max-w-sm">
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        <Display
          currentValue={state.currentValue}
          expression={state.expression}
          saveStatus={saveStatus}
        />
        <div className="grid grid-cols-4 gap-1 p-4 bg-slate-800">
          {buttons.map((btn) => (
            <Button
              key={btn.value}
              label={btn.label}
              value={btn.value}
              variant={btn.variant}
              onClick={() => handleButton(btn.value)}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 text-center">
        <a
          href="/history"
          className="text-slate-400 hover:text-white text-sm transition-colors underline underline-offset-2"
        >
          View Calculation History →
        </a>
      </div>
    </div>
  );
}
