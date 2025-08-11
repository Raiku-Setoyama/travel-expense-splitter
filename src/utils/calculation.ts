import { Participant, Expense, ParticipantBalance, SettlementTransaction, ExchangeRate } from '@/types';

export function convertToBaseCurrency(
  amount: number,
  fromCurrency: string,
  baseCurrency: string,
  exchangeRates: ExchangeRate | null
): number {
  if (fromCurrency === baseCurrency) {
    return amount;
  }
  
  if (!exchangeRates || !exchangeRates.rates[fromCurrency] || !exchangeRates.rates[baseCurrency]) {
    return amount;
  }
  
  const rate = exchangeRates.rates[baseCurrency] / exchangeRates.rates[fromCurrency];
  return amount * rate;
}

export function calculateBalances(
  participants: Participant[],
  expenses: Expense[],
  baseCurrency: string,
  exchangeRates: ExchangeRate | null
): ParticipantBalance[] {
  const total = expenses.reduce((sum, expense) => {
    const convertedAmount = convertToBaseCurrency(
      expense.amount,
      expense.currency,
      baseCurrency,
      exchangeRates
    );
    return sum + convertedAmount;
  }, 0);
  
  const perPerson = participants.length > 0 ? total / participants.length : 0;
  
  return participants.map(participant => {
    const paid = expenses
      .filter(expense => expense.payerId === participant.id)
      .reduce((sum, expense) => {
        const convertedAmount = convertToBaseCurrency(
          expense.amount,
          expense.currency,
          baseCurrency,
          exchangeRates
        );
        return sum + convertedAmount;
      }, 0);
    
    return {
      participantId: participant.id,
      paid,
      shouldPay: perPerson,
      balance: paid - perPerson,
    };
  });
}

export function calculateSettlements(
  participants: Participant[],
  balances: ParticipantBalance[],
  baseCurrency: string
): SettlementTransaction[] {
  const settlements: SettlementTransaction[] = [];
  
  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({
      participant: participants.find(p => p.id === b.participantId)!,
      amount: Math.round(b.balance * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount);
  
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({
      participant: participants.find(p => p.id === b.participantId)!,
      amount: Math.round(Math.abs(b.balance) * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount);
  
  let creditorIndex = 0;
  let debtorIndex = 0;
  
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    
    const amount = Math.min(creditor.amount, debtor.amount);
    
    if (amount > 0.01) {
      settlements.push({
        fromParticipant: debtor.participant,
        toParticipant: creditor.participant,
        amount: Math.round(amount * 100) / 100,
        currency: baseCurrency,
      });
    }
    
    creditor.amount -= amount;
    debtor.amount -= amount;
    
    if (creditor.amount < 0.01) {
      creditorIndex++;
    }
    if (debtor.amount < 0.01) {
      debtorIndex++;
    }
  }
  
  return settlements;
}