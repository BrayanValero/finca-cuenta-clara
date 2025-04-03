
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';

type AuthMode = 'login' | 'register';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la lógica de autenticación con Supabase
      
      // Por ahora, simulamos un login exitoso
      setTimeout(() => {
        setLoading(false);
        if (mode === 'login') {
          toast({
            title: "Inicio de sesión exitoso",
            description: "Bienvenido a Finca Cuenta Clara",
          });
          navigate('/');
        } else {
          toast({
            title: "Registro exitoso",
            description: "Tu cuenta ha sido creada. Ya puedes iniciar sesión.",
          });
          setMode('login');
        }
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
      });
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
          disabled={loading}
          style={{ backgroundColor: "#4D5726" }}
        >
          {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
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
