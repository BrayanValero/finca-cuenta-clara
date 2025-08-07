import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentForm from '@/components/DocumentForm';
import DocumentTable from '@/components/DocumentTable';
import DocumentBatchImport from '@/components/DocumentBatchImport';
import { useDocuments } from '@/hooks/useDocuments';

const Documents: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: documents, isLoading } = useDocuments();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary">Documentación</h1>
          <p className="text-muted-foreground">
            Gestiona enlaces a documentos importantes de Drive
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Agregar Documento
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Documento</CardTitle>
            <CardDescription>
              Agrega un enlace a un documento importante de Google Drive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <DocumentTable documents={documents || []} />
    </div>
  );
};

export default Documents;