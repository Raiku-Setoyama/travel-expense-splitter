'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseFormData } from '@/utils/validation';
import { useStore } from '@/store';
import { Expense } from '@/types';
import { CURRENCIES } from '@/constants/currencies';
import { format } from 'date-fns';

export default function ExpenseForm() {
  const participants = useStore((state) => state.participants);
  const addExpense = useStore((state) => state.addExpense);
  const baseCurrency = useStore((state) => state.baseCurrency);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      currency: baseCurrency,
      date: new Date(),
    },
  });
  
  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    
    try {
      const newExpense: Expense = {
        id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        payerId: data.payerId,
        amount: data.amount,
        currency: data.currency,
        description: data.description || '',
        date: data.date,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addExpense(newExpense);
      reset({
        currency: baseCurrency,
        date: new Date(),
      });
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (participants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">支払いを記録するには、まず参加者を追加してください</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="payerId" className="block text-sm font-medium text-gray-700 mb-1">
            支払者
          </label>
          <select
            {...register('payerId')}
            id="payerId"
            className="input-field"
            disabled={isSubmitting}
          >
            <option value="">選択してください</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
          {errors.payerId && (
            <p className="mt-1 text-sm text-red-600">{errors.payerId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            金額
          </label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            id="amount"
            className="input-field"
            placeholder="0"
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            通貨
          </label>
          <select
            {...register('currency')}
            id="currency"
            className="input-field"
            disabled={isSubmitting}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            日付
          </label>
          <input
            type="datetime-local"
            id="date"
            className="input-field"
            defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setValue('date', new Date(e.target.value))}
            disabled={isSubmitting}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          説明（任意）
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="input-field"
          placeholder="支払いの内容を入力"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full md:w-auto"
      >
        {isSubmitting ? '追加中...' : '支払いを追加'}
      </button>
    </form>
  );
}