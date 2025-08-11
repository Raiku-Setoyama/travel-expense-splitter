'use client';

import { SettlementTransaction } from '@/types';
import { getCurrencySymbol } from '@/constants/currencies';

interface TransferInstructionProps {
  settlements: SettlementTransaction[];
  baseCurrency: string;
}

export default function TransferInstruction({
  settlements,
  baseCurrency,
}: TransferInstructionProps) {
  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol(baseCurrency)}${amount.toLocaleString('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };
  
  if (settlements.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-2 text-lg font-medium text-gray-900">精算完了！</p>
        <p className="text-gray-600">全員の支払いが均等になっています</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">送金指示</h3>
      
      <div className="space-y-3">
        {settlements.map((settlement, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border-2 border-blue-200 p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {settlement.fromParticipant.name}
                  </p>
                  <p className="text-sm text-gray-500">支払う人</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {formatCurrency(settlement.amount)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {settlement.toParticipant.name}
                  </p>
                  <p className="text-sm text-gray-500">受け取る人</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">送金のヒント</p>
            <ul className="list-disc list-inside space-y-1">
              <li>上記の送金を行うことで、全員の負担が均等になります</li>
              <li>送金回数は最小限に最適化されています</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}