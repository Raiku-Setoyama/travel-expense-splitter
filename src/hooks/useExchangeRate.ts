import { useEffect } from 'react';
import { useStore } from '@/store';
import { fetchExchangeRates } from '@/utils/currency';

export function useExchangeRate() {
  const setExchangeRates = useStore((state) => state.setExchangeRates);
  const exchangeRates = useStore((state) => state.exchangeRates);
  
  useEffect(() => {
    const loadRates = async () => {
      console.log('Loading exchange rates...');
      const rates = await fetchExchangeRates('USD');
      if (rates) {
        console.log('Exchange rates loaded successfully:', rates);
        setExchangeRates(rates);
      } else {
        console.error('Failed to load exchange rates');
      }
    };
    
    if (!exchangeRates) {
      loadRates();
    }
    
    const interval = setInterval(loadRates, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [exchangeRates, setExchangeRates]);
  
  const refreshRates = async () => {
    console.log('Refreshing exchange rates...');
    const rates = await fetchExchangeRates('USD');
    if (rates) {
      console.log('Exchange rates refreshed successfully:', rates);
      setExchangeRates(rates);
      return true;
    }
    console.error('Failed to refresh exchange rates');
    return false;
  };
  
  return {
    exchangeRates,
    refreshRates,
  };
}