'use client';

import { ParticipantBalance, Participant } from '@/types';
import { getCurrencySymbol } from '@/constants/currencies';
import { cn } from '@/utils/cn';
import { useStore } from '@/store';

interface SettlementResultProps {
  participants: Participant[];
  balances: ParticipantBalance[];
  baseCurrency: string;
}

export default function SettlementResult({
  participants,
  balances,
  baseCurrency,
}: SettlementResultProps) {
  const expenses = useStore((state) => state.expenses);
  const exchangeRates = useStore((state) => state.exchangeRates);
  
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明';
  };
  
  const getParticipantExpenseDetails = (participantId: string) => {
    const participantExpenses = expenses.filter(e => e.payerId === participantId);
    const hasForeignCurrency = participantExpenses.some(e => e.currency !== baseCurrency);
    const currenciesUsed = [...new Set(participantExpenses.map(e => e.currency))];
    
    return {
      hasForeignCurrency,
      currenciesUsed,
      expenseCount: participantExpenses.length,
    };
  };
  
  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol(baseCurrency)}${amount.toLocaleString('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };
  
  const getBalanceStatus = (balance: number) => {
    if (Math.abs(balance) < 0.01) return 'even';
    return balance > 0 ? 'credit' : 'debt';
  };
  
  const getBalanceColor = (status: string) => {
    switch (status) {
      case 'credit':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'debt':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusText = (balance: number) => {
    if (Math.abs(balance) < 0.01) {
      return '精算済み';
    }
    if (balance > 0) {
      return `${formatCurrency(balance)} 受け取る`;
    }
    return `${formatCurrency(Math.abs(balance))} 支払う`;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">個人別精算状況</h3>
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {balances.map((balance) => {
          const status = getBalanceStatus(balance.balance);
          const color = getBalanceColor(status);
          const expenseDetails = getParticipantExpenseDetails(balance.participantId);
          
          return (
            <div
              key={balance.participantId}
              className={cn(
                'rounded-lg border-2 p-4 transition-all hover:shadow-md',
                color
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {getParticipantName(balance.participantId)}
                  </h4>
                  {expenseDetails.hasForeignCurrency && (
                    <div className="text-xs text-blue-600 mt-1">
                      使用通貨: {expenseDetails.currenciesUsed.join(', ')}
                    </div>
                  )}
                </div>
                {status === 'even' && (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">支払った額:</span>
                  <span className="font-medium">{formatCurrency(balance.paid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">負担すべき額:</span>
                  <span className="font-medium">{formatCurrency(balance.shouldPay)}</span>
                </div>
                {expenseDetails.hasForeignCurrency && (
                  <div className="text-xs text-gray-500 italic">
                    ({baseCurrency}換算済み)
                  </div>
                )}
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">精算:</span>
                    <span className={cn('font-bold', status === 'even' && 'text-green-600')}>
                      {getStatusText(balance.balance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {balances.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          精算する内容がありません
        </div>
      )}
    </div>
  );
}