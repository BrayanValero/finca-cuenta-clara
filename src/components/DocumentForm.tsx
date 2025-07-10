import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useDocumentMutations } from '@/hooks/useDocumentMutations';

const documentSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  drive_url: z.string().url('Debe ser una URL válida'),
  document_type: z.string().min(1, 'El tipo de documento es requerido'),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  onSuccess: () => void;
  document?: any;
}

const documentTypes = [
  { value: 'factura', label: 'Factura' },
  { value: 'declaracion', label: 'Declaración' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'recibo', label: 'Recibo' },
  { value: 'certificado', label: 'Certificado' },
  { value: 'otro', label: 'Otro' },
];

const DocumentForm: React.FC<DocumentFormProps> = ({ onSuccess, document }) => {
  const { createDocument, updateDocument } = useDocumentMutations();
  
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: document?.title || '',
      description: document?.description || '',
      drive_url: document?.drive_url || '',
      document_type: document?.document_type || '',
    },
  });

  const onSubmit = async (data: DocumentFormData) => {
    try {
      if (document) {
        await updateDocument.mutateAsync({ 
          id: document.id, 
          title: data.title,
          description: data.description,
          drive_url: data.drive_url,
          document_type: data.document_type
        });
      } else {
        await createDocument.mutateAsync({
          title: data.title,
          description: data.description,
          drive_url: data.drive_url,
          document_type: data.document_type
        });
      }
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Factura de enero 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="drive_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Google Drive</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://drive.google.com/file/d/..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción adicional del documento"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={createDocument.isPending || updateDocument.isPending}
          >
            {document ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentForm;