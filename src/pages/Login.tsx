
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative" style={{ backgroundImage: 'url("/lovable-uploads/01018185-9285-44e6-a198-621a4621db1a.png")' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-[2px]" />
      
      <div className="w-full max-w-md relative z-10 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between bg-card/80 backdrop-blur-md rounded-lg p-4 shadow-elegant">
          <AppLogo />
          <div className="font-semibold text-lg text-card-foreground">
            {email ? getWelcomeMessage(email) : 'Bienvenido'}
          </div>
        </div>
        
        <Card className="w-full backdrop-blur-md bg-card/95 shadow-xl border-border/50 card-elevated">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              H-V Farm
            </CardTitle>
            <CardDescription className="text-center text-base">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 transition-smooth"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 transition-smooth"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-11"
                size="lg"
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
