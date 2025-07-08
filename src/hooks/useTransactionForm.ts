import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { TransactionInput } from '@/services/transactionService';
import { categorizeTransaction } from '@/utils/transactionUtils';
import { FormData, CategorySuggestion } from '@/types/TransactionFormTypes';

export const useTransactionForm = (editTransaction?: any) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date(),
    type: 'gasto',
    description: '',
    amount: 0
  });

  const [categorySuggestion, setCategorySuggestion] = useState<CategorySuggestion>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [manualCategory, setManualCategory] = useState<string>('');

  // Load data when editing
  useEffect(() => {
    if (editTransaction) {
      setFormData({
        fecha: new Date(editTransaction.date),
        type: editTransaction.type,
        description: editTransaction.description || '',
        amount: editTransaction.amount
      });
    }
  }, [editTransaction]);

  // Get category suggestion
  const getSuggestion = async (description: string, type: 'ingreso' | 'gasto') => {
    if (!description.trim()) {
      setShowSuggestion(false);
      return;
    }

    try {
      const suggestion = await categorizeTransaction(description, type);
      setCategorySuggestion(suggestion);
      setShowSuggestion(true);
      setManualCategory(suggestion.category);
    } catch (error) {
      console.error('Error getting category suggestion:', error);
    }
  };

  // Auto-suggest category on description change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.description && formData.description.length > 3) {
        getSuggestion(formData.description, formData.type);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [formData.description, formData.type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    if (name === 'type' && formData.description) {
      getSuggestion(formData.description, value as 'ingreso' | 'gasto');
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, fecha: date });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fecha || !formData.amount) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const prepareTransactionData = (): TransactionInput => ({
    date: formData.fecha.toISOString().split('T')[0],
    type: formData.type,
    description: formData.description || null,
    amount: Number(formData.amount)
  });

  const resetForm = () => {
    setFormData({
      fecha: new Date(),
      type: 'gasto',
      description: '',
      amount: 0
    });
  };

  const handleAcceptSuggestion = () => {
    setShowSuggestion(false);
    toast({
      title: "Categoría aplicada",
      description: `Se aplicó la categoría: ${categorySuggestion?.category}`,
    });
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setManualCategory('');
    toast({
      title: "Sugerencia rechazada",
      description: "Puedes asignar una categoría manualmente si lo deseas.",
    });
  };

  return {
    formData,
    categorySuggestion,
    showSuggestion,
    manualCategory,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    validateForm,
    prepareTransactionData,
    resetForm,
    handleAcceptSuggestion,
    handleRejectSuggestion
  };
};