import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { useTransactionMutations } from '@/hooks/useTransactionMutations';
import { TransactionFormProps } from '@/types/TransactionFormTypes';
import TransactionFormFields from './TransactionForm/TransactionFormFields';

const TransactionForm = ({ editTransaction, onSuccess }: TransactionFormProps) => {
  const { user } = useAuth();
  
  const {
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
  } = useTransactionForm(editTransaction);

  const { createTransactionMutation, updateTransactionMutation } = useTransactionMutations(() => {
    resetForm();
    if (onSuccess) onSuccess();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const transactionData = prepareTransactionData();

    if (editTransaction) {
      updateTransactionMutation.mutate({ 
        id: editTransaction.id, 
        data: transactionData 
      });
    } else {
      createTransactionMutation.mutate(transactionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TransactionFormFields
        formData={formData}
        categorySuggestion={categorySuggestion}
        showSuggestion={showSuggestion}
        manualCategory={manualCategory}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onDateChange={handleDateChange}
        onAcceptSuggestion={handleAcceptSuggestion}
        onRejectSuggestion={handleRejectSuggestion}
      />

      <Button 
        type="submit" 
        className="w-full md:w-auto bg-farm-green hover:bg-farm-lightgreen text-white"
        disabled={createTransactionMutation.isPending || updateTransactionMutation.isPending}
      >
        {editTransaction 
          ? (updateTransactionMutation.isPending ? "Actualizando..." : "Actualizar Transacción") 
          : (createTransactionMutation.isPending ? "Procesando..." : "Registrar Transacción")}
      </Button>
    </form>
  );
};

export default TransactionForm;
