export interface Participant {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
  currency: string;
}

export interface ExchangeRate {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface AppState {
  participants: Participant[];
  expenses: Expense[];
  baseCurrency: string;
  exchangeRates: ExchangeRate | null;
}

export type Currency = {
  code: string;
  name: string;
  symbol: string;
}

export interface ParticipantBalance {
  participantId: string;
  paid: number;
  shouldPay: number;
  balance: number;
}

export interface SettlementTransaction {
  fromParticipant: Participant;
  toParticipant: Participant;
  amount: number;
  currency: string;
}