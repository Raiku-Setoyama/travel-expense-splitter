'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { CURRENCIES } from '@/constants/currencies';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function CurrencySettings() {
  const baseCurrency = useStore((state) => state.baseCurrency);
  const setBaseCurrency = useStore((state) => state.setBaseCurrency);
  const { exchangeRates, refreshRates } = useExchangeRate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshRates();
      if (success) {
        console.log('Successfully refreshed exchange rates');
      } else {
        console.error('Failed to refresh exchange rates');
      }
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">通貨設定</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="baseCurrency" className="block text-sm font-medium text-gray-700 mb-1">
            基準通貨
          </label>
          <select
            id="baseCurrency"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="input-field"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            精算時の計算に使用される通貨です
          </p>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">為替レート</h4>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {isRefreshing ? '更新中...' : '更新'}
            </button>
          </div>
          
          {exchangeRates ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  最終更新: {format(new Date(exchangeRates.date), 'yyyy年MM月dd日', { locale: ja })}
                </p>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs">接続済み</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
                  <p>Base: {exchangeRates.base}</p>
                </div>
                {CURRENCIES.slice(0, 8).map((currency) => {
                  const rate = exchangeRates.rates[currency.code];
                  const baseRate = exchangeRates.rates[baseCurrency];
                  
                  if (!rate || !baseRate) {
                    return (
                      <div key={currency.code} className="flex justify-between text-gray-400">
                        <span>1 {currency.code}</span>
                        <span>レートなし</span>
                      </div>
                    );
                  }
                  
                  const convertedRate = baseRate / rate;
                  
                  return (
                    <div key={currency.code} className="flex justify-between">
                      <span className="text-gray-600">1 {currency.code}</span>
                      <span className="font-medium">
                        = {convertedRate.toFixed(4)} {baseCurrency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">為替レートを取得中...</p>
                <div className="flex items-center text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
                  <span className="text-xs">接続中</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">為替レートについて</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>リアルタイムレートはExchangeRate-APIから取得されます</li>
                  <li>オフライン時は最後に取得したレートが使用されます</li>
                  <li>1時間ごとに自動更新されます</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}