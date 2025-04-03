
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLogo from './AppLogo';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'register';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, isLoading } = useAuth();

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <AppLogo className="justify-center" />
        <h1 className="text-2xl font-bold tracking-tight text-farm-green dark:text-farm-beige">
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === 'login' 
            ? 'Ingresa tus credenciales para acceder a la aplicación' 
            : 'Crea una cuenta para comenzar a utilizar la aplicación'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          style={{ backgroundColor: "#4D5726" }}
        >
          {isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>
      </form>

      <div className="text-center">
        <Button variant="link" onClick={toggleMode} className="text-farm-green dark:text-farm-beige">
          {mode === 'login' 
            ? '¿No tienes una cuenta? Regístrate' 
            : '¿Ya tienes una cuenta? Inicia sesión'}
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
