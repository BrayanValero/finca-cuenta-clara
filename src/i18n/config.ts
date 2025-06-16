
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
      "personal": "Personal",
      
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
      
      // Loans
      "manageLoans": "Gestiona los préstamos recibidos y otorgados",
      "loanListing": "Listado de Préstamos",
      "pendingLoans": "Préstamos Pendientes",
      "registerLoan": "Registrar Préstamo",
      "newLoan": "Nuevo Préstamo",
      
      // Statistics
      "visualAnalysis": "Análisis visual de tus finanzas",
      "general": "General",
      "income": "Ingresos",
      "expenses": "Gastos",
      "trends": "Tendencias",
      
      // Reports
      "generateReports": "Genera informes y análisis de tus finanzas en H-V Farm",
      "quickReports": "Informes Rápidos",
      "customReport": "Informe Personalizado",
      "preview": "Vista Previa",
      
      // Personal
      "personalSection": "Sección Personal",
      "userZone": "Zona de usuario",
      "editProfile": "Editar Perfil",
      "signOut": "Cerrar sesión",
      "save": "Guardar",
      "cancel": "Cancelar",
      "name": "Nombre",
      "lastName": "Apellido",
      
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
      "personal": "Personal",
      
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
      
      // Loans
      "manageLoans": "Manage received and granted loans",
      "loanListing": "Loan Listing",
      "pendingLoans": "Pending Loans",
      "registerLoan": "Register Loan",
      "newLoan": "New Loan",
      
      // Statistics
      "visualAnalysis": "Visual analysis of your finances",
      "general": "General",
      "income": "Income",
      "expenses": "Expenses",
      "trends": "Trends",
      
      // Reports
      "generateReports": "Generate reports and analysis of your H-V Farm finances",
      "quickReports": "Quick Reports",
      "customReport": "Custom Report",
      "preview": "Preview",
      
      // Personal
      "personalSection": "Personal Section",
      "userZone": "User zone",
      "editProfile": "Edit Profile",
      "signOut": "Sign Out",
      "save": "Save",
      "cancel": "Cancel",
      "name": "Name",
      "lastName": "Last Name",
      
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
