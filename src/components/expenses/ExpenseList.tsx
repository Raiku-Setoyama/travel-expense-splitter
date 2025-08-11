'use client';

import { useStore } from '@/store';
import ExpenseItem from './ExpenseItem';
import ExpenseForm from './ExpenseForm';
import { getCurrencySymbol } from '@/constants/currencies';

export default function ExpenseList() {
  const expenses = useStore((state) => state.expenses);
  const participants = useStore((state) => state.participants);
  const baseCurrency = useStore((state) => state.baseCurrency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const calculateTotalInBaseCurrency = () => {
    return expenses.reduce((sum, expense) => {
      if (expense.currency === baseCurrency) {
        return sum + expense.amount;
      }
      
      if (exchangeRates && exchangeRates.rates[expense.currency] && exchangeRates.rates[baseCurrency]) {
        const rate = exchangeRates.rates[baseCurrency] / exchangeRates.rates[expense.currency];
        return sum + (expense.amount * rate);
      }
      
      // 為替レートが取得できない場合はそのままの値を使用
      console.warn(`Exchange rate not available for ${expense.currency} to ${baseCurrency}`);
      return sum + expense.amount;
    }, 0);
  };
  
  const total = calculateTotalInBaseCurrency();
  const averagePerPerson = participants.length > 0 ? total / participants.length : 0;
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">支払い記録</h2>
        <ExpenseForm />
      </div>
      
      {expenses.length > 0 && (
        <>
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">支払い統計</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">支払い回数</p>
                <p className="text-2xl font-bold text-gray-900">{expenses.length}回</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">合計金額（{baseCurrency}換算）</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCurrencySymbol(baseCurrency)}{total.toLocaleString('ja-JP', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">一人当たり（{baseCurrency}換算）</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCurrencySymbol(baseCurrency)}{averagePerPerson.toLocaleString('ja-JP', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                支払い履歴
              </h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedExpenses.map((expense) => {
                const participant = participants.find(p => p.id === expense.payerId);
                return (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    participant={participant}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
      
      {expenses.length === 0 && participants.length > 0 && (
        <div className="card text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <p className="mt-2 text-gray-600">まだ支払い記録がありません</p>
          <p className="text-sm text-gray-500 mt-1">上のフォームから支払いを記録してください</p>
        </div>
      )}
    </div>
  );
}