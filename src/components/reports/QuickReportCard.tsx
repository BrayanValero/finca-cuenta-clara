
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';

interface QuickReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onPreview: () => void;
  onGenerate: () => void;
}

const QuickReportCard = ({ 
  title, 
  description, 
  icon: Icon,
  onPreview,
  onGenerate
}: QuickReportCardProps) => {
  return (
    <Card className="hover:border-farm-brown transition-colors">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-farm-green dark:text-farm-beige" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Button 
            onClick={onPreview} 
            variant="outline" 
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            Vista previa
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onGenerate} 
          className="w-full bg-farm-brown hover:bg-farm-lightbrown text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generar PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickReportCard;
