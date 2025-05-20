
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useQueryClient } from '@tanstack/react-query';
import { createTransaction, TransactionInput, determineCategory } from '@/services/transactionService';

// Interface for the row data from Excel
interface ExcelRowData {
  [key: string]: string | number | null;
}

const FileUpload = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const formatDate = (dateString: string | number): string => {
    // Handle Excel date formats (numeric) or string formats
    let date: Date;
    
    if (typeof dateString === 'number') {
      // Excel dates are stored as days since 1900-01-01
      date = new Date(Math.round((dateString - 25569) * 86400 * 1000));
    } else {
      // Try to parse the date string
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Format DD/MM/YYYY to YYYY-MM-DD
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        date = new Date(dateString);
      }
    }
    
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    toast({
      title: "Procesando archivo",
      description: "Las transacciones están siendo importadas...",
    });
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assuming first sheet contains the data
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(worksheet);
        
        // Process transactions
        let successCount = 0;
        let errorCount = 0;
        
        // Map expected column names from Spanish to our data model
        for (const row of jsonData) {
          try {
            // Check which columns are available in the file
            const dateKey = row.hasOwnProperty('Fecha') ? 'Fecha' : 'fecha';
            const descKey = row.hasOwnProperty('Descripción') ? 'Descripción' : 
                           (row.hasOwnProperty('Descripcion') ? 'Descripcion' : 'descripcion');
            const incomeKey = row.hasOwnProperty('Ingreso') ? 'Ingreso' : 'ingreso';
            const expenseKey = row.hasOwnProperty('Gasto') ? 'Gasto' : 'gasto';
            
            // Handle amount and transaction type
            let amount = 0;
            let type: 'ingreso' | 'gasto' = 'gasto';
            
            const incomeValue = row[incomeKey];
            const expenseValue = row[expenseKey];
            
            if (incomeValue && incomeValue !== 0) {
              // It's an income
              amount = typeof incomeValue === 'string' 
                ? parseFloat(incomeValue.replace(/[^\d.-]/g, ''))
                : Number(incomeValue);
              type = 'ingreso';
            } else if (expenseValue && expenseValue !== 0) {
              // It's an expense
              amount = typeof expenseValue === 'string'
                ? parseFloat(expenseValue.replace(/[^\d.-]/g, ''))
                : Number(expenseValue);
              type = 'gasto';
            }
            
            if (amount <= 0) {
              continue; // Skip rows with zero or negative amounts
            }
            
            // Get description from the row
            const description = String(row[descKey] || '');
            
            const dateValue = row[dateKey];
            if (!dateValue) {
              console.error('Missing date value in row:', row);
              errorCount++;
              continue;
            }
            
            const transaction: TransactionInput = {
              date: formatDate(dateValue),
              type,
              description: description || null,
              amount: Math.abs(amount),
              category: determineCategory(description) // Add category here
            };
            
            await createTransaction(transaction);
            successCount++;
          } catch (err) {
            console.error('Error processing row:', row, err);
            errorCount++;
          }
        }
        
        // Refresh the transactions list
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        
        toast({
          title: "Importación completada",
          description: `${successCount} transacciones importadas con éxito. ${errorCount > 0 ? `${errorCount} transacciones con error.` : ''}`,
        });
        
        setFile(null);
        setIsProcessing(false);
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error al procesar el archivo",
        description: "Ha ocurrido un error al procesar el archivo. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
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
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Procesar Archivo"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
