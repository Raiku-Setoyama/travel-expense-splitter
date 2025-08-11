import axios from 'axios';
import { ExchangeRate } from '@/types';

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest';

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface CachedExchangeRate extends ExchangeRate {
  timestamp: number;
}

export async function fetchExchangeRates(base: string = 'EUR'): Promise<ExchangeRate | null> {
  try {
    const cached = getCachedRates();
    if (cached && cached.base === base && isCacheValid(cached.timestamp)) {
      return {
        base: cached.base,
        date: cached.date,
        rates: cached.rates,
      };
    }
    
    // Try primary API first
    const apiUrl = `${EXCHANGE_API_URL}/${base}`;
    
    const response = await axios.get(apiUrl, { timeout: 10000 });
    
    if (response.data && response.data.rates) {
      const exchangeRate: ExchangeRate = {
        base: response.data.base || base,
        date: response.data.date || new Date().toISOString().split('T')[0],
        rates: response.data.rates,
      };
      
      cacheRates({
        ...exchangeRate,
        timestamp: Date.now(),
      });
      
      return exchangeRate;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    const cached = getCachedRates();
    if (cached) {
      return {
        base: cached.base,
        date: cached.date,
        rates: cached.rates,
      };
    }
    
    return getFallbackRates();
  }
}

function getCachedRates(): CachedExchangeRate | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to read cached rates:', error);
  }
  return null;
}

function cacheRates(rates: CachedExchangeRate): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
  } catch (error) {
    console.error('Failed to cache rates:', error);
  }
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

function getFallbackRates(): ExchangeRate {
  return {
    base: 'USD',
    date: new Date().toISOString().split('T')[0],
    rates: {
      USD: 1,
      EUR: 0.92,
      JPY: 149.5,
      GBP: 0.79,
      CNY: 7.24,
      KRW: 1320,
      THB: 35.8,
      SGD: 1.35,
      AUD: 1.52,
      CAD: 1.36,
      CHF: 0.88,
      HKD: 7.83,
      TWD: 31.2,
      INR: 83.1,
      MYR: 4.68,
      PHP: 56.2,
      VND: 24500,
      IDR: 15400,
    },
  };
}