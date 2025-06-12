
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Globe, Monitor } from 'lucide-react';
import { sessionService, UserSession } from '@/services/sessionService';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LastSessionInfo = () => {
  const { user } = useAuth();
  const [lastSession, setLastSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastSession = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const session = await sessionService.getLastSession();
      setLastSession(session);
      setIsLoading(false);
    };

    fetchLastSession();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp", { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const getBrowserInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Navegador desconocido';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Otro navegador';
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Información de Sesión
        </CardTitle>
        <CardDescription>
          Detalles de tu última sesión iniciada
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : lastSession ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Usuario:</span>
              <Badge variant="outline">{lastSession.user_email || 'Email no disponible'}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Último acceso:</span>
              <span className="text-sm">{formatDate(lastSession.login_time)}</span>
            </div>
            
            {lastSession.ip_address && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dirección IP:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {lastSession.ip_address}
                </code>
              </div>
            )}
            
            {lastSession.user_agent && (
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Navegador:</span>
                <Badge variant="secondary">
                  {getBrowserInfo(lastSession.user_agent)}
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No se encontró información de sesiones anteriores.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LastSessionInfo;
