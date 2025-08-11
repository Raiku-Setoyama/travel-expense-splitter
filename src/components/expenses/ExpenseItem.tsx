'use client';

import { useState } from 'react';
import { Expense, Participant } from '@/types';
import { useStore } from '@/store';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getCurrencySymbol } from '@/constants/currencies';
import { convertToBaseCurrency } from '@/utils/calculation';

interface ExpenseItemProps {
  expense: Expense;
  participant: Participant | undefined;
}

export default function ExpenseItem({ expense, participant }: ExpenseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());
  const [editDescription, setEditDescription] = useState(expense.description);
  
  const updateExpense = useStore((state) => state.updateExpense);
  const deleteExpense = useStore((state) => state.deleteExpense);
  const baseCurrency = useStore((state) => state.baseCurrency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  
  const handleUpdate = () => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount > 0) {
      updateExpense(expense.id, {
        amount,
        description: editDescription,
      });
      setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
    deleteExpense(expense.id);
    setShowDeleteConfirm(false);
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };
  
  const convertedAmount = convertToBaseCurrency(
    expense.amount,
    expense.currency,
    baseCurrency,
    exchangeRates
  );
  
  const showConversion = expense.currency !== baseCurrency && exchangeRates;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="input-field w-32"
                  placeholder="金額"
                />
                <span className="py-2 text-gray-600">{expense.currency}</span>
              </div>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-field w-full"
                rows={2}
                placeholder="説明"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="btn-primary text-sm py-1 px-3"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditAmount(expense.amount.toString());
                    setEditDescription(expense.description);
                    setIsEditing(false);
                  }}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(expense.amount, expense.currency)}
                </span>
                <span className="text-sm text-gray-500">({expense.currency})</span>
              </div>
              
              {showConversion && (
                <div className="mb-1 text-sm text-blue-600">
                  ≈ {formatCurrency(convertedAmount, baseCurrency)} ({baseCurrency}換算)
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-1">
                支払者: <span className="font-medium">{participant?.name || '不明'}</span>
              </p>
              
              {expense.description && (
                <p className="text-sm text-gray-700 mb-1">{expense.description}</p>
              )}
              
              <p className="text-xs text-gray-500">
                {format(new Date(expense.date), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
              </p>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="編集"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 p-1"
              title="削除"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 mb-3">
            この支払い記録を削除しますか？
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="btn-danger text-sm py-1 px-3"
            >
              削除する
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-secondary text-sm py-1 px-3"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}