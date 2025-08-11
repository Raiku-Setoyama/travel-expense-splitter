import { z } from 'zod';

export const participantSchema = z.object({
  name: z.string()
    .min(1, '名前は必須です')
    .max(50, '名前は50文字以内で入力してください')
    .refine(val => val.trim().length > 0, '空白のみの名前は使用できません'),
});

export const expenseSchema = z.object({
  payerId: z.string().min(1, '支払者を選択してください'),
  amount: z.number()
    .positive('金額は0より大きい値を入力してください')
    .max(999999999, '金額が大きすぎます')
    .refine(val => {
      const decimals = val.toString().split('.')[1];
      return !decimals || decimals.length <= 2;
    }, '小数点以下は2桁までです'),
  currency: z.string().min(1, '通貨を選択してください'),
  description: z.string()
    .max(200, '説明は200文字以内で入力してください')
    .optional(),
  date: z.date(),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;