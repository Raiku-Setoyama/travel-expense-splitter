'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { participantSchema, ParticipantFormData } from '@/utils/validation';
import { useStore } from '@/store';
import { Participant } from '@/types';

export default function ParticipantForm() {
  const addParticipant = useStore((state) => state.addParticipant);
  const participants = useStore((state) => state.participants);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
  });
  
  const onSubmit = async (data: ParticipantFormData) => {
    setIsSubmitting(true);
    
    try {
      let finalName = data.name.trim();
      
      const existingNames = participants.filter(p => 
        p.name.startsWith(finalName)
      );
      
      if (existingNames.length > 0) {
        const numbers = existingNames
          .map(p => {
            const match = p.name.match(/(.+)\s\((\d+)\)$/);
            if (match && match[1] === finalName) {
              return parseInt(match[2]);
            }
            return p.name === finalName ? 1 : 0;
          })
          .filter(n => n > 0);
        
        const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 2;
        finalName = `${finalName} (${nextNumber})`;
      }
      
      const newParticipant: Participant = {
        id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: finalName,
        createdAt: new Date(),
      };
      
      addParticipant(newParticipant);
      reset();
    } catch (error) {
      console.error('Failed to add participant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          参加者名
        </label>
        <div className="flex gap-2">
          <input
            {...register('name')}
            type="text"
            id="name"
            className="input-field flex-1"
            placeholder="参加者の名前を入力"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary whitespace-nowrap"
          >
            {isSubmitting ? '追加中...' : '追加'}
          </button>
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
    </form>
  );
}