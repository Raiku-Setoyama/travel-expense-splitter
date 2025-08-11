import { Currency } from '@/types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: '米ドル', symbol: '$' },
  { code: 'JPY', name: '日本円', symbol: '¥' },
  { code: 'EUR', name: 'ユーロ', symbol: '€' },
  { code: 'GBP', name: '英ポンド', symbol: '£' },
  { code: 'CNY', name: '中国元', symbol: '¥' },
  { code: 'KRW', name: '韓国ウォン', symbol: '₩' },
  { code: 'THB', name: 'タイバーツ', symbol: '฿' },
  { code: 'SGD', name: 'シンガポールドル', symbol: 'S$' },
  { code: 'AUD', name: '豪ドル', symbol: 'A$' },
  { code: 'CAD', name: 'カナダドル', symbol: 'C$' },
  { code: 'CHF', name: 'スイスフラン', symbol: 'Fr' },
  { code: 'HKD', name: '香港ドル', symbol: 'HK$' },
  { code: 'TWD', name: '台湾ドル', symbol: 'NT$' },
  { code: 'INR', name: 'インドルピー', symbol: '₹' },
  { code: 'MYR', name: 'マレーシアリンギット', symbol: 'RM' },
  { code: 'PHP', name: 'フィリピンペソ', symbol: '₱' },
  { code: 'VND', name: 'ベトナムドン', symbol: '₫' },
  { code: 'IDR', name: 'インドネシアルピア', symbol: 'Rp' },
];

export const DEFAULT_CURRENCY = 'USD';

export function getCurrencySymbol(code: string): string {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency?.symbol || code;
}

export function getCurrencyName(code: string): string {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency?.name || code;
}