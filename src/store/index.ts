import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Participant, Expense, ExchangeRate } from '@/types';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

interface AppStore {
  participants: Participant[];
  expenses: Expense[];
  baseCurrency: string;
  exchangeRates: ExchangeRate | null;
  
  addParticipant: (participant: Participant) => void;
  updateParticipant: (id: string, name: string) => void;
  deleteParticipant: (id: string) => void;
  
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  setBaseCurrency: (currency: string) => void;
  setExchangeRates: (rates: ExchangeRate) => void;
  
  clearAll: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      participants: [],
      expenses: [],
      baseCurrency: DEFAULT_CURRENCY,
      exchangeRates: null,
      
      addParticipant: (participant) =>
        set((state) => ({
          participants: [...state.participants, participant],
        })),
        
      updateParticipant: (id, name) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        })),
        
      deleteParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
          expenses: state.expenses.filter((e) => e.payerId !== id),
        })),
        
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),
        
      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id
              ? { ...e, ...expense, updatedAt: new Date() }
              : e
          ),
        })),
        
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
        
      setBaseCurrency: (currency) =>
        set(() => ({
          baseCurrency: currency,
        })),
        
      setExchangeRates: (rates) =>
        set(() => ({
          exchangeRates: rates,
        })),
        
      clearAll: () =>
        set(() => ({
          participants: [],
          expenses: [],
          baseCurrency: DEFAULT_CURRENCY,
          exchangeRates: null,
        })),
    }),
    {
      name: 'travel-expense-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);