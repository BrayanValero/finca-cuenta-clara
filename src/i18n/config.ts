
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  es: {
    translation: {
      // Navigation
      "dashboard": "Panel",
      "transactions": "Transacciones",
      "loans": "Préstamos",
      "statistics": "Estadísticas",
      "reports": "Informes",
      
      // Login
      "welcome": "Bienvenido",
      "accessToFarm": "Acceso a H-V Farm",
      "enterCredentials": "Ingresa tus credenciales para acceder al sistema",
      "email": "Correo electrónico",
      "password": "Contraseña",
      "signIn": "Iniciar Sesión",
      "signingIn": "Iniciando sesión...",
      
      // Dashboard
      "financialSummary": "Resumen financiero de tu finca",
      "totalBalance": "Balance Total",
      "monthlyIncome": "Ingresos Mensuales",
      "monthlyExpenses": "Gastos Mensuales",
      "liquidity": "Liquidez",
      "latestTransactions": "Últimas Transacciones",
      
      // Transactions
      "manageIncomeExpenses": "Gestiona los ingresos y gastos de tu finca",
      "listing": "Listado",
      "addTransaction": "Agregar Transacción",
      "importExcel": "Importar Excel",
      "newTransaction": "Nueva Transacción",
      "importFromExcel": "Importar desde Excel",
      
      // Common
      "loading": "Cargando...",
      "date": "Fecha",
      "type": "Tipo",
      "description": "Descripción",
      "amount": "Monto",
      "balance": "Saldo",
      "search": "Buscar..."
    }
  },
  en: {
    translation: {
      // Navigation
      "dashboard": "Dashboard",
      "transactions": "Transactions",
      "loans": "Loans",
      "statistics": "Statistics", 
      "reports": "Reports",
      
      // Login
      "welcome": "Welcome",
      "accessToFarm": "Access to H-V Farm",
      "enterCredentials": "Enter your credentials to access the system",
      "email": "Email",
      "password": "Password",
      "signIn": "Sign In",
      "signingIn": "Signing in...",
      
      // Dashboard
      "financialSummary": "Financial summary of your farm",
      "totalBalance": "Total Balance",
      "monthlyIncome": "Monthly Income",
      "monthlyExpenses": "Monthly Expenses",
      "liquidity": "Liquidity",
      "latestTransactions": "Latest Transactions",
      
      // Transactions
      "manageIncomeExpenses": "Manage your farm's income and expenses",
      "listing": "Listing",
      "addTransaction": "Add Transaction",
      "importExcel": "Import Excel",
      "newTransaction": "New Transaction",
      "importFromExcel": "Import from Excel",
      
      // Common
      "loading": "Loading...",
      "date": "Date",
      "type": "Type",
      "description": "Description",
      "amount": "Amount",
      "balance": "Balance",
      "search": "Search..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
