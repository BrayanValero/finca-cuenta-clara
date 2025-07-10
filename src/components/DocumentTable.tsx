import React, { useState } from 'react';
import { ExternalLink, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DocumentForm from './DocumentForm';
import { useDocumentMutations } from '@/hooks/useDocumentMutations';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Document {
  id: string;
  title: string;
  description?: string;
  drive_url: string;
  document_type: string;
  created_at: string;
}

interface DocumentTableProps {
  documents: Document[];
}

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    factura: 'bg-blue-100 text-blue-800',
    declaracion: 'bg-green-100 text-green-800',
    contrato: 'bg-purple-100 text-purple-800',
    recibo: 'bg-yellow-100 text-yellow-800',
    certificado: 'bg-pink-100 text-pink-800',
    otro: 'bg-gray-100 text-gray-800',
  };
  return colors[type] || colors.otro;
};

const getTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    factura: 'Factura',
    declaracion: 'Declaración',
    contrato: 'Contrato',
    recibo: 'Recibo',
    certificado: 'Certificado',
    otro: 'Otro',
  };
  return labels[type] || 'Otro';
};

const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const { deleteDocument } = useDocumentMutations();

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      await deleteDocument.mutateAsync(id);
    }
  };

  const openDriveLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4" />
            <p>No hay documentos registrados</p>
            <p className="text-sm">Agrega tu primer documento para comenzar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                <Badge className={getTypeColor(document.document_type)}>
                  {getTypeLabel(document.document_type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {document.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {document.description}
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mb-4">
                Agregado el {format(new Date(document.created_at), 'dd/MM/yyyy', { locale: es })}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openDriveLink(document.drive_url)}
                  className="flex-1"
                >
                  <ExternalLink size={16} className="mr-1" />
                  Abrir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingDocument(document)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(document.id)}
                  disabled={deleteDocument.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
          </DialogHeader>
          {editingDocument && (
            <DocumentForm
              document={editingDocument}
              onSuccess={() => setEditingDocument(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentTable;