export type FormData = {
  fecha: Date;
  type: 'ingreso' | 'gasto';
  description: string;
  amount: number;
};

export type TransactionFormProps = {
  editTransaction?: {
    id: string;
    date: string;
    type: 'ingreso' | 'gasto';
    description: string | null;
    amount: number;
  } | null;
  onSuccess?: () => void;
};

export type CategorySuggestion = {
  category: string;
  confidence: number;
  source: 'rules' | 'ai';
} | null;