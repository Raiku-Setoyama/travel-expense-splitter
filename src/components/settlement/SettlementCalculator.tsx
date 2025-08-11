'use client';

import { useStore } from '@/store';
import { calculateBalances, calculateSettlements } from '@/utils/calculation';
import SettlementResult from './SettlementResult';
import TransferInstruction from './TransferInstruction';

export default function SettlementCalculator() {
  const participants = useStore((state) => state.participants);
  const expenses = useStore((state) => state.expenses);
  const baseCurrency = useStore((state) => state.baseCurrency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  
  if (participants.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">精算</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">精算を行うには、まず参加者を追加してください</p>
        </div>
      </div>
    );
  }
  
  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">精算</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">精算を行うには、支払い記録を追加してください</p>
        </div>
      </div>
    );
  }
  
  const balances = calculateBalances(participants, expenses, baseCurrency, exchangeRates);
  const settlements = calculateSettlements(participants, balances, baseCurrency);
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">精算</h2>
        
        <SettlementResult
          participants={participants}
          balances={balances}
          baseCurrency={baseCurrency}
        />
      </div>
      
      <div className="card">
        <TransferInstruction
          settlements={settlements}
          baseCurrency={baseCurrency}
        />
      </div>
    </div>
  );
}