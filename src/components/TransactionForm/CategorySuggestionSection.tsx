import CategorySuggestion from '../CategorySuggestion';
import { CategorySuggestion as CategorySuggestionType } from '@/types/TransactionFormTypes';

type CategorySuggestionSectionProps = {
  categorySuggestion: CategorySuggestionType;
  showSuggestion: boolean;
  manualCategory: string;
  onAccept: () => void;
  onReject: () => void;
};

const CategorySuggestionSection = ({
  categorySuggestion,
  showSuggestion,
  manualCategory,
  onAccept,
  onReject
}: CategorySuggestionSectionProps) => {
  return (
    <>
      {/* Category suggestion */}
      <CategorySuggestion
        suggestion={categorySuggestion!}
        onAccept={onAccept}
        onReject={onReject}
        isVisible={showSuggestion && !!categorySuggestion}
      />
      
      {/* Selected category display */}
      {manualCategory && !showSuggestion && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
          <span className="text-sm text-green-800">
            Categoría: <strong>{manualCategory}</strong>
          </span>
        </div>
      )}
    </>
  );
};

export default CategorySuggestionSection;