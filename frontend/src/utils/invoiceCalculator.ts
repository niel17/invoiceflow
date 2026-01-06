import { CreateLineItemDTO } from '../types';

export const calculateSubtotal = (lineItems: CreateLineItemDTO[]): number => {
  return lineItems.reduce((sum, item) => {
    return sum + item.quantity * item.rate;
  }, 0);
};

export const applyDiscount = (
  amount: number,
  discountType?: 'percentage' | 'fixed',
  discountValue?: number
): number => {
  if (!discountType || !discountValue) {
    return 0;
  }

  if (discountType === 'percentage') {
    return (amount * discountValue) / 100;
  }

  return discountValue;
};

export const calculateTax = (amount: number, taxRate: number): number => {
  return (amount * taxRate) / 100;
};

export const calculateTotal = (
  subtotal: number,
  taxRate: number,
  discountType?: 'percentage' | 'fixed',
  discountValue?: number
): {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
} => {
  const discountAmount = applyDiscount(subtotal, discountType, discountValue);
  const amountAfterDiscount = subtotal - discountAmount;
  const taxAmount = calculateTax(amountAfterDiscount, taxRate);
  const total = amountAfterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
};

