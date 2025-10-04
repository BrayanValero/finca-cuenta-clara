import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Animal } from '@/services/animalService';
import { supabase } from '@/integrations/supabase/client';

interface AnimalProfileCardProps {
  animal: Animal;
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  };
  onClick: () => void;
}

const AnimalProfileCard: React.FC<AnimalProfileCardProps> = ({ animal, summary, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = () => {
    if (!animal.image_url) return null;
    
    // Si ya es una URL completa, devolverla
    if (animal.image_url.startsWith('http')) {
      return animal.image_url;
    }
    
    // Si es una ruta de storage, construir la URL pública
    const { data } = supabase.storage
      .from('animal-images')
      .getPublicUrl(animal.image_url);
    
    return data.publicUrl;
  };

  const imageUrl = getImageUrl();

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={animal.name || 'Animal'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-farm-lightgreen to-farm-green flex items-center justify-center">
            <span className="text-8xl">
              {animal.animal_type === 'vacas' ? '🐄' : '🐾'}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-farm-darkgreen">
            {animal.quantity} {animal.quantity === 1 ? 'animal' : 'animales'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-farm-darkgreen mb-2">
          {animal.name || 'Sin nombre'}
        </h3>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Balance:</span>
            <span className={`font-semibold ${
              summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(summary.balance)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transacciones:</span>
            <span className="font-medium">{summary.transactionCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimalProfileCard;
