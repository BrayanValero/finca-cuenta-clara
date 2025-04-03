
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const FileUpload = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    processFile(files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Verificar tipo de archivo
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast({
        title: "Formato no válido",
        description: "Por favor sube un archivo Excel (.xlsx, .xls) o CSV",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
    toast({
      title: "Archivo cargado",
      description: `${file.name} ha sido cargado con éxito.`,
    });
  };

  const handleUpload = () => {
    if (!file) return;
    
    // Aquí iría la lógica para procesar el archivo
    toast({
      title: "Procesando archivo",
      description: "Las transacciones están siendo importadas...",
    });
    
    // Simulación de procesamiento
    setTimeout(() => {
      toast({
        title: "Importación completada",
        description: "Todas las transacciones han sido importadas exitosamente.",
      });
      setFile(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging 
            ? "border-farm-brown bg-farm-brown/10" 
            : "border-border hover:border-farm-brown/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Arrastra tu archivo aquí</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          O <span className="text-farm-brown cursor-pointer font-medium">busca en tu dispositivo</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Soporta archivos Excel (.xlsx, .xls) y CSV
        </p>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          id="file-upload"
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Seleccionar Archivo
        </Button>
      </div>

      {file && (
        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <Button 
            onClick={handleUpload}
            className="bg-farm-brown hover:bg-farm-lightbrown text-white"
          >
            Procesar Archivo
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
