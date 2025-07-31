import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PaymentForm from './PaymentForm';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  installment: {
    _id: string;
    amount: number;
    installmentNumber: number;
    dueDate: string;
  } | null;
  onPaymentSuccess: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  installment,
  onPaymentSuccess
}) => {
  const handleSuccess = () => {
    onPaymentSuccess();
    onClose();
  };

  if (!installment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Pay Installment #{installment.installmentNumber}
          </DialogTitle>
        </DialogHeader>
        <PaymentForm
          installmentId={installment._id}
          amount={installment.amount}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;