
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Bot, Zap } from 'lucide-react';

interface CategorySuggestionProps {
  suggestion: {
    category: string;
    confidence: number;
    source: 'rules' | 'ai';
  };
  onAccept: () => void;
  onReject: () => void;
  isVisible: boolean;
}

const CategorySuggestion = ({ suggestion, onAccept, onReject, isVisible }: CategorySuggestionProps) => {
  if (!isVisible) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getSourceIcon = (source: string) => {
    return source === 'rules' ? <Zap className="h-3 w-3" /> : <Bot className="h-3 w-3" />;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {getSourceIcon(suggestion.source)}
            <span className="text-sm font-medium text-blue-800">
              Categoría sugerida:
            </span>
          </div>
          <Badge variant="secondary" className="font-medium">
            {suggestion.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
          >
            {Math.round(suggestion.confidence * 100)}% confianza
          </Badge>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onAccept}
            className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onReject}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategorySuggestion;
