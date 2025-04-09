
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';

interface ReportFormActionsProps {
  onPreview: (e: React.MouseEvent) => void;
  onSubmit: (e: React.MouseEvent) => void;
  isGenerating: boolean;
}

const ReportFormActions = ({ onPreview, onSubmit, isGenerating }: ReportFormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onPreview}
      >
        <Eye className="mr-2 h-4 w-4" />
        Vista previa
      </Button>
      
      <Button
        type="button"
        className="flex-1 bg-farm-green hover:bg-farm-lightgreen text-white"
        disabled={isGenerating}
        onClick={onSubmit}
      >
        {isGenerating ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generando...
          </span>
        ) : (
          <span className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Generar PDF
          </span>
        )}
      </Button>
    </div>
  );
};

export default ReportFormActions;
