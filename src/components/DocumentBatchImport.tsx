import React, { useState } from 'react';
import { Check, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDocumentMutations } from '@/hooks/useDocumentMutations';
import { parseGoogleDriveLinks, createDocumentsBatch } from '@/utils/documentBatchImport';

interface DocumentBatchImportProps {
  links: string;
  onComplete: () => void;
}

const DocumentBatchImport: React.FC<DocumentBatchImportProps> = ({ links, onComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);
  
  const { createDocument } = useDocumentMutations();
  const parsedDocuments = parseGoogleDriveLinks(links);

  const handleImport = async () => {
    setIsImporting(true);
    setProgress(0);
    
    const result = await createDocumentsBatch(
      parsedDocuments,
      createDocument,
      (completed, total) => {
        setProgress((completed / total) * 100);
      }
    );
    
    setImportResult(result);
    setIsImporting(false);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Factura': 'bg-blue-100 text-blue-800',
      'Declaración de Impuestos': 'bg-green-100 text-green-800',
      'Escritura': 'bg-purple-100 text-purple-800',
      'Identificación': 'bg-yellow-100 text-yellow-800',
      'Planos': 'bg-indigo-100 text-indigo-800',
      'Otros': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors['Otros'];
  };

  if (importResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Importación Completada
          </CardTitle>
          <CardDescription>
            Se procesaron {parsedDocuments.length} documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>✅ {importResult.success} documentos creados exitosamente</p>
            {importResult.errors > 0 && (
              <p>❌ {importResult.errors} documentos con errores</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Detectados</CardTitle>
        <CardDescription>
          Se encontraron {parsedDocuments.length} enlaces de Google Drive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isImporting && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Importando documentos...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {parsedDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{doc.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className={getTypeColor(doc.documentType)}>
                {doc.documentType}
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleImport} 
            disabled={isImporting}
            className="flex-1"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Importar {parsedDocuments.length} Documentos
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onComplete} disabled={isImporting}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentBatchImport;