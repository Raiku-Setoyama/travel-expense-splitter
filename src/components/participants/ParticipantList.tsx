'use client';

import { useStore } from '@/store';
import ParticipantItem from './ParticipantItem';
import ParticipantForm from './ParticipantForm';

export default function ParticipantList() {
  const participants = useStore((state) => state.participants);
  const expenses = useStore((state) => state.expenses);
  const baseCurrency = useStore((state) => state.baseCurrency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  
  const getParticipantStats = (participantId: string) => {
    const participantExpenses = expenses.filter(e => e.payerId === participantId);
    const expenseCount = participantExpenses.length;
    
    const totalPaid = participantExpenses.reduce((sum, expense) => {
      if (expense.currency === baseCurrency) {
        return sum + expense.amount;
      }
      
      if (exchangeRates && exchangeRates.rates[expense.currency] && exchangeRates.rates[baseCurrency]) {
        const rate = exchangeRates.rates[baseCurrency] / exchangeRates.rates[expense.currency];
        return sum + (expense.amount * rate);
      }
      
      // 為替レートが取得できない場合はそのままの値を使用（フォールバック）
      console.warn(`Exchange rate not available for ${expense.currency} to ${baseCurrency}`);
      return sum + expense.amount;
    }, 0);
    
    return { expenseCount, totalPaid };
  };
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">参加者管理</h2>
        <ParticipantForm />
      </div>
      
      {participants.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              参加者一覧 ({participants.length}名)
            </h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {participants.map((participant) => {
              const stats = getParticipantStats(participant.id);
              return (
                <ParticipantItem
                  key={participant.id}
                  participant={participant}
                  expenseCount={stats.expenseCount}
                  totalPaid={stats.totalPaid}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {participants.length === 0 && (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="mt-2 text-gray-600">まだ参加者が登録されていません</p>
          <p className="text-sm text-gray-500 mt-1">上のフォームから参加者を追加してください</p>
        </div>
      )}
    </div>
  );
}