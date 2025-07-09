import React from "react";
import { Bell, Mail, AlertTriangle, Calendar, DollarSign, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { preferences, isLoading, updatePreferences, sendTestEmail } = useNotificationPreferences(user?.id);

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    if (!preferences) return;
    updatePreferences.mutate({ [key]: value });
  };

  const handleThresholdChange = (value: string) => {
    const threshold = parseFloat(value) || 0;
    updatePreferences.mutate({ large_expense_threshold: threshold });
  };

  const handleTestEmail = () => {
    sendTestEmail.mutate("large_expense");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configuración de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-theme-primary dark:text-white">
          <Bell className="h-5 w-5" />
          Configuración de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-theme-primary" />
            <div>
              <Label className="text-sm font-medium">Notificaciones por Email</Label>
              <p className="text-xs text-muted-foreground">Activar/desactivar todas las notificaciones por email</p>
            </div>
          </div>
          <Switch
            checked={preferences.email_notifications}
            onCheckedChange={(checked) => handleToggle("email_notifications", checked)}
          />
        </div>

        <Separator />

        {/* Individual notification settings */}
        <div className="space-y-4 opacity-100" style={{ opacity: preferences.email_notifications ? 1 : 0.5 }}>
          {/* Budget Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <Label className="text-sm font-medium">Alertas de Presupuesto</Label>
                <p className="text-xs text-muted-foreground">Recibir alertas cuando superes tu presupuesto</p>
              </div>
            </div>
            <Switch
              checked={preferences.budget_alerts}
              onCheckedChange={(checked) => handleToggle("budget_alerts", checked)}
              disabled={!preferences.email_notifications}
            />
          </div>

          {/* Large Expense Alerts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-red-500" />
                <div>
                  <Label className="text-sm font-medium">Alertas de Gastos Grandes</Label>
                  <p className="text-xs text-muted-foreground">Notificación cuando registres un gasto significativo</p>
                </div>
              </div>
              <Switch
                checked={preferences.large_expense_alert}
                onCheckedChange={(checked) => handleToggle("large_expense_alert", checked)}
                disabled={!preferences.email_notifications}
              />
            </div>
            
            {preferences.large_expense_alert && preferences.email_notifications && (
              <div className="ml-7 flex items-center gap-2">
                <Label className="text-xs">Umbral:</Label>
                <Input
                  type="number"
                  value={preferences.large_expense_threshold}
                  onChange={(e) => handleThresholdChange(e.target.value)}
                  className="w-24 h-8 text-xs"
                  min="0"
                  step="100"
                />
                <span className="text-xs text-muted-foreground">€</span>
              </div>
            )}
          </div>

          {/* Transaction Reminders */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <Label className="text-sm font-medium">Recordatorios de Transacciones</Label>
                <p className="text-xs text-muted-foreground">Recordatorios para registrar transacciones</p>
              </div>
            </div>
            <Switch
              checked={preferences.transaction_reminders}
              onCheckedChange={(checked) => handleToggle("transaction_reminders", checked)}
              disabled={!preferences.email_notifications}
            />
          </div>

          {/* Weekly Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <Label className="text-sm font-medium">Resumen Semanal</Label>
                <p className="text-xs text-muted-foreground">Recibir un resumen de actividad cada semana</p>
              </div>
            </div>
            <Switch
              checked={preferences.weekly_summary}
              onCheckedChange={(checked) => handleToggle("weekly_summary", checked)}
              disabled={!preferences.email_notifications}
            />
          </div>

          {/* Monthly Report */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <Label className="text-sm font-medium">Reporte Mensual</Label>
                <p className="text-xs text-muted-foreground">Recibir un reporte detallado cada mes</p>
              </div>
            </div>
            <Switch
              checked={preferences.monthly_report}
              onCheckedChange={(checked) => handleToggle("monthly_report", checked)}
              disabled={!preferences.email_notifications}
            />
          </div>
        </div>

        <Separator />

        {/* Test Email Button */}
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-sm font-medium">Probar Notificaciones</Label>
            <p className="text-xs text-muted-foreground">Enviar un email de prueba para verificar la configuración</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestEmail}
            disabled={!preferences.email_notifications || sendTestEmail.isPending}
          >
            {sendTestEmail.isPending ? "Enviando..." : "Enviar Prueba"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;