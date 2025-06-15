// Función para normalizar descripciones similares
export const normalizeDescription = (description: string): string => {
  if (!description) return 'Sin descripción';
  
  const normalized = description.toLowerCase().trim();
  
  // Normalizar variaciones de "semana marcos"
  if (normalized.includes('marcos') && (normalized.includes('semana') || normalized.includes('pago'))) {
    return 'semana marcos';
  }
  
  // Normalizar variaciones de "deuda de marcos"
  if (normalized.includes('marcos') && normalized.includes('deuda')) {
    return 'deuda de marcos';
  }
  
  // Normalizar variaciones de "venta cacao"
  if (normalized.includes('cacao') && normalized.includes('venta')) {
    return 'venta cacao';
  }
  
  // Normalizar variaciones de "gasolina"
  if (normalized === 'gasolina' || normalized === ' gasolina' || normalized === 'gasolina ') {
    return 'gasolina';
  }
  
  // Normalizar variaciones de "guadañador" (incluyendo "guarañador")
  if (normalized === 'guarañador' || normalized === 'guadañador') {
    return 'guadañador';
  }
  
  // Normalizar variaciones de "gasolina guadaña"
  if (normalized === 'gasolina guadaña' || normalized === 'gasolina guadaña') {
    return 'gasolina guadaña';
  }
  
  // Devolver la descripción original normalizada a minúsculas
  return normalized;
};

// Función para formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'COP', 
    currencyDisplay: 'symbol' 
  }).format(amount);
};

// Categorías predefinidas para la finca
export const CATEGORIES = {
  // Ingresos
  VENTA_CACAO: 'Venta Cacao',
  VENTA_CAFE: 'Venta Café',
  VENTA_OTROS: 'Venta Otros Productos',
  OTROS_INGRESOS: 'Otros Ingresos',
  
  // Gastos operativos
  COMBUSTIBLE: 'Combustible',
  MANO_OBRA: 'Mano de Obra',
  INSUMOS: 'Insumos Agrícolas',
  HERRAMIENTAS: 'Herramientas y Equipos',
  
  // Gastos administrativos
  DEUDAS: 'Deudas y Préstamos',
  SERVICIOS: 'Servicios',
  TRANSPORTE: 'Transporte',
  OTROS_GASTOS: 'Otros Gastos'
} as const;

// Función para categorización automática basada en reglas
export const categorizeByRules = (description: string, type: 'ingreso' | 'gasto'): string | null => {
  if (!description) return null;
  
  const normalized = description.toLowerCase().trim();
  
  if (type === 'ingreso') {
    // Reglas para ingresos
    if (normalized.includes('cacao') && normalized.includes('venta')) {
      return CATEGORIES.VENTA_CACAO;
    }
    if (normalized.includes('café') && normalized.includes('venta')) {
      return CATEGORIES.VENTA_CAFE;
    }
    if (normalized.includes('venta')) {
      return CATEGORIES.VENTA_OTROS;
    }
    return CATEGORIES.OTROS_INGRESOS;
  } else {
    // Reglas para gastos
    if (normalized.includes('gasolina') || normalized.includes('combustible') || normalized.includes('diesel')) {
      return CATEGORIES.COMBUSTIBLE;
    }
    if (normalized.includes('marcos') || normalized.includes('jornales') || normalized.includes('trabajador') || normalized.includes('guadañador')) {
      return CATEGORIES.MANO_OBRA;
    }
    if (normalized.includes('deuda') || normalized.includes('préstamo') || normalized.includes('banco')) {
      return CATEGORIES.DEUDAS;
    }
    if (normalized.includes('fertilizante') || normalized.includes('semilla') || normalized.includes('abono') || normalized.includes('plaguicida')) {
      return CATEGORIES.INSUMOS;
    }
    if (normalized.includes('herramienta') || normalized.includes('machete') || normalized.includes('bomba') || normalized.includes('equipo')) {
      return CATEGORIES.HERRAMIENTAS;
    }
    if (normalized.includes('transporte') || normalized.includes('viaje') || normalized.includes('pasaje')) {
      return CATEGORIES.TRANSPORTE;
    }
    if (normalized.includes('luz') || normalized.includes('agua') || normalized.includes('teléfono') || normalized.includes('internet')) {
      return CATEGORIES.SERVICIOS;
    }
    return CATEGORIES.OTROS_GASTOS;
  }
};

// Función para sugerir categoría usando IA (placeholder para ahora)
export const suggestCategoryWithAI = async (description: string, type: 'ingreso' | 'gasto'): Promise<string> => {
  // Por ahora retornamos una categoría por defecto
  // Después implementaremos la integración con OpenAI
  return type === 'ingreso' ? CATEGORIES.OTROS_INGRESOS : CATEGORIES.OTROS_GASTOS;
};

// Función principal de categorización híbrida
export const categorizeTransaction = async (description: string, type: 'ingreso' | 'gasto'): Promise<{
  category: string;
  confidence: number;
  source: 'rules' | 'ai';
}> => {
  // Intentar primero con reglas
  const ruleCategory = categorizeByRules(description, type);
  
  if (ruleCategory && ruleCategory !== (type === 'ingreso' ? CATEGORIES.OTROS_INGRESOS : CATEGORIES.OTROS_GASTOS)) {
    return {
      category: ruleCategory,
      confidence: 0.95, // Alta confianza para reglas específicas
      source: 'rules'
    };
  }
  
  // Si las reglas no dan una categoría específica, usar IA
  try {
    const aiCategory = await suggestCategoryWithAI(description, type);
    return {
      category: aiCategory,
      confidence: 0.75, // Confianza media para IA
      source: 'ai'
    };
  } catch (error) {
    console.error('Error in AI categorization:', error);
    // Fallback a categoría por defecto
    return {
      category: type === 'ingreso' ? CATEGORIES.OTROS_INGRESOS : CATEGORIES.OTROS_GASTOS,
      confidence: 0.5,
      source: 'rules'
    };
  }
};

// Función para procesar datos de descripción para gráficos
export const processDescriptionData = (transactions: any[], type: 'gastos' | 'ingresos') => {
  if (!transactions || transactions.length === 0) return [];
  
  const filteredTransactions = transactions.filter(t => 
    type === 'gastos' ? t.type === 'gasto' : t.type === 'ingreso'
  );
  
  if (filteredTransactions.length === 0) return [];
  
  // Agrupar por descripción normalizada
  const descriptions: Record<string, number> = {};
  filteredTransactions.forEach(transaction => {
    const normalizedDescription = normalizeDescription(transaction.description || 'Sin descripción');
    if (!descriptions[normalizedDescription]) {
      descriptions[normalizedDescription] = 0;
    }
    descriptions[normalizedDescription] += Number(transaction.amount);
  });
  
  // Convertir a formato para gráfico
  return Object.entries(descriptions).map(([name, value]) => ({
    name,
    value
  }));
};
