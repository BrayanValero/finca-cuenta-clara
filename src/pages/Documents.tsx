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
  const [showBatchImport, setShowBatchImport] = useState(false);
  const { data: documents, isLoading } = useDocuments();

  const driveLinks = `https://drive.google.com/file/d/15BneFTQ4dGgT5RoUy-QDXC-x3CmdP1zY/view?usp=sharing, https://drive.google.com/file/d/15FW56hQsqp5gINBpQKeaSkJ-3HcTiJKY/view?usp=sharing, https://drive.google.com/file/d/15HipMLI_OJ_WJiRvKavmNKb9izF_5a4b/view?usp=sharing, https://drive.google.com/file/d/15I2iyPYFc9UgmtUpBlXdCnCcl13vuzxC/view?usp=sharing, https://drive.google.com/file/d/15NZMgsoP4OvqwOfefaeiGvQJ2sN8hzw8/view?usp=sharing, https://drive.google.com/file/d/15NpR-bG5tVpLJZ0xR6kdquwxEydjxYRa/view?usp=sharing, https://drive.google.com/file/d/15Pz17-X2D09rHuZU3pwNMNe6dyO2knRn/view?usp=sharing, https://drive.google.com/file/d/15RJk_id5Xe22ZZtvHfo2ecZPHpAbXF7Q/view?usp=sharing, https://drive.google.com/file/d/15RMd-l1KTvc7WW5pNx5b5zriMuVmzxTi/view?usp=sharing, https://drive.google.com/file/d/15X0bBn2yJ-uVI1QKHwFwj1ALr8s_FD7p/view?usp=sharing, https://drive.google.com/file/d/15XTy6QJlAd6VQsEiF7h4c_viGVoQclj1/view?usp=sharing, https://drive.google.com/file/d/15XceZ8VT9tjIewgPSWfj6j5IZNId0OVT/view?usp=sharing, https://drive.google.com/file/d/15YVhOPu84Mh-sxt0pk0VnQqq5DybKba7/view?usp=sharing, https://drive.google.com/file/d/15a4i6I5JaK4jdalrEBUfwLskGF5sCDMF/view?usp=sharing, https://drive.google.com/file/d/15bofUHTnIe3H_Os5bhXlfLMVQQlCSvwq/view?usp=sharing, https://drive.google.com/file/d/15d-bNOK8p2wpJxuw8KYtZAqWl4VLNyI2/view?usp=sharing, https://drive.google.com/file/d/15e3Qc2gJwmutJVg69fRq44umuKv4E-Fv/view?usp=sharing, https://drive.google.com/file/d/15fc4LIUiw6nTp2p1Q7XhKV0QZMoUlgQ9/view?usp=sharing, https://drive.google.com/file/d/15oqdh_r3ALINsdfjZHrDr_AikGMz4hcB/view?usp=sharing, https://drive.google.com/file/d/15pZDX9rFuVLACpRiI23pmJRr7ir_2DNv/view?usp=sharing, https://drive.google.com/file/d/1FqK_HKYUG4vvM5uuSz1RWFKNp4jLVPkH/view?usp=sharing`;

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

      {showBatchImport && (
        <DocumentBatchImport 
          links={driveLinks}
          onComplete={() => setShowBatchImport(false)}
        />
      )}

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