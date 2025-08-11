'use client';

import { useState } from 'react';
import { Participant } from '@/types';
import { useStore } from '@/store';

interface ParticipantItemProps {
  participant: Participant;
  expenseCount: number;
  totalPaid: number;
}

export default function ParticipantItem({ 
  participant, 
  expenseCount, 
  totalPaid 
}: ParticipantItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(participant.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const updateParticipant = useStore((state) => state.updateParticipant);
  const deleteParticipant = useStore((state) => state.deleteParticipant);
  const baseCurrency = useStore((state) => state.baseCurrency);
  
  const handleUpdate = () => {
    if (editName.trim() && editName !== participant.name) {
      updateParticipant(participant.id, editName.trim());
    }
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    deleteParticipant(participant.id);
    setShowDeleteConfirm(false);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: baseCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleUpdate();
                }}
                autoFocus
              />
              <button
                onClick={handleUpdate}
                className="text-green-600 hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setEditName(participant.name);
                  setIsEditing(false);
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{participant.name}</h3>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">
                  支払い回数: <span className="font-medium">{expenseCount}回</span>
                </p>
                <p className="text-sm text-gray-600">
                  支払い総額: <span className="font-medium">{formatCurrency(totalPaid)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="編集"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 p-1"
              title="削除"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 mb-3">
            {participant.name}を削除しますか？
            {expenseCount > 0 && (
              <>
                <br />
                <span className="font-medium">この参加者の支払い記録も削除されます。</span>
              </>
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="btn-danger text-sm py-1 px-3"
            >
              削除する
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-secondary text-sm py-1 px-3"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}