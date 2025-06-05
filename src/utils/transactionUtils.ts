
// Función para normalizar descripciones similares
export const normalizeDescription = (description: string): string => {
  if (!description) return 'Sin descripción';
  
  const normalized = description.toLowerCase().trim();
  
  // Normalizar variaciones de "semana marcos"
  if (normalized.includes('marcos') && (normalized.includes('semana') || normalized.includes('pago'))) {
    return 'semana marcos';
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
  
  return description;
};

// Función para formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'COP', 
    currencyDisplay: 'symbol' 
  }).format(amount);
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
