interface ParsedDocument {
  title: string;
  driveUrl: string;
  documentType: string;
  description: string;
}

export const parseGoogleDriveLinks = (text: string): ParsedDocument[] => {
  const driveUrlRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing/g;
  const matches = text.match(driveUrlRegex) || [];
  
  return matches.map((url, index) => {
    const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)\//)?.[1] || '';
    
    // Generate descriptive titles based on position
    const titles = [
      'Documento Financiero 1', 'Factura Comercial', 'Declaración Tributaria',
      'Escritura Inmobiliaria', 'Documento de Identificación', 'Plano Arquitectónico 1',
      'Contrato Legal', 'Certificado Oficial', 'Documento Administrativo',
      'Factura de Servicios', 'Declaración Anual', 'Escritura Pública',
      'Plano Arquitectónico 2', 'Documento Personal', 'Certificado Técnico',
      'Contrato de Servicio', 'Documento Tributario', 'Factura Detallada',
      'Plano de Construcción', 'Documento Oficial', 'Archivo Complementario'
    ];

    // Suggest document types based on title patterns
    const getDocumentType = (title: string): string => {
      if (title.includes('Factura')) return 'Factura';
      if (title.includes('Declaración') || title.includes('Tributario')) return 'Declaración de Impuestos';
      if (title.includes('Escritura')) return 'Escritura';
      if (title.includes('Identificación') || title.includes('Personal')) return 'Identificación';
      if (title.includes('Plano')) return 'Planos';
      return 'Otros';
    };

    const title = titles[index] || `Documento ${index + 1}`;
    
    return {
      title,
      driveUrl: url,
      documentType: getDocumentType(title),
      description: `Documento importado automáticamente - ID: ${fileId.substring(0, 8)}`
    };
  });
};

export const createDocumentsBatch = async (
  documents: ParsedDocument[],
  createDocumentMutation: any,
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: number; errors: number }> => {
  let success = 0;
  let errors = 0;

  for (let i = 0; i < documents.length; i++) {
    try {
      await createDocumentMutation.mutateAsync({
        title: documents[i].title,
        description: documents[i].description,
        drive_url: documents[i].driveUrl,
        document_type: documents[i].documentType
      });
      success++;
    } catch (error) {
      console.error(`Error creating document ${i + 1}:`, error);
      errors++;
    }
    
    if (onProgress) {
      onProgress(i + 1, documents.length);
    }
  }

  return { success, errors };
};