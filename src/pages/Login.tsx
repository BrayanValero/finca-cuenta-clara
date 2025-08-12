
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/AppLogo';


const Login = () => {
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getWelcomeMessage = (email: string) => {
    if (email === 'brayanvalero0021@gmail.com') {
      return 'Bienvenido Brayan Valero';
    } else {
      return 'Bienvenido Carlos Valero';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: 'url("/lovable-uploads/01018185-9285-44e6-a198-621a4621db1a.png")' }}>
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <AppLogo className="text-white" />
          <div className="text-white font-semibold text-xl">
            {email ? getWelcomeMessage(email) : 'Bienvenido'}
          </div>
        </div>
        <Card className="w-full bg-white/90 dark:bg-farm-green/95 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Acceso a H-V Farm</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-farm-green hover:bg-farm-darkgreen dark:bg-farm-lightgreen dark:hover:bg-farm-green"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
