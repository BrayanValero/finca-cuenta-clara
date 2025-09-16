import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EggDebtor } from '@/services/eggDebtorService';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface EggDebtorTableProps {
  debtors: EggDebtor[];
  onEdit?: (debtor: EggDebtor) => void;
  onDelete?: (debtorId: string) => void;
  onAddPayment?: (debtor: EggDebtor) => void;
}

export const EggDebtorTable: React.FC<EggDebtorTableProps> = ({
  debtors,
  onEdit,
  onDelete,
  onAddPayment
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (debtors.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No hay deudores registrados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Deudores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {debtors.map((debtor) => (
            <div
              key={debtor.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{debtor.debtor_name}</h3>
                  {debtor.phone && (
                    <span className="text-sm text-muted-foreground">
                      📞 {debtor.phone}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 mb-2">
                  {debtor.cartons_owed > 0 && (
                    <Badge variant="outline">
                      {debtor.cartons_owed} cartones
                    </Badge>
                  )}
                  {debtor.eggs_owed > 0 && (
                    <Badge variant="outline">
                      {debtor.eggs_owed} huevos
                    </Badge>
                  )}
                </div>

                {debtor.notes && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {debtor.notes}
                  </p>
                )}

                <div className="text-sm text-muted-foreground">
                  Precios: Cartón {formatCurrency(debtor.price_per_carton)} - 
                  Huevo {formatCurrency(debtor.price_per_egg)}
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="font-bold text-lg text-red-600">
                  {formatCurrency(debtor.total_debt)}
                </div>
                
                <div className="flex gap-1">
                  {onAddPayment && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddPayment(debtor)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(debtor)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(debtor.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};