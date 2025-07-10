import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  budget_alerts: boolean;
  transaction_reminders: boolean;
  weekly_summary: boolean;
  monthly_report: boolean;
  large_expense_alert: boolean;
  large_expense_threshold: number;
  email_notifications: boolean;
}

export function useNotificationPreferences(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ["notification_preferences", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      // Return default preferences if none exist
      if (!data) {
        return {
          user_id: userId,
          budget_alerts: true,
          transaction_reminders: true,
          weekly_summary: false,
          monthly_report: false,
          large_expense_alert: true,
          large_expense_threshold: 1000,
          email_notifications: true,
        } as NotificationPreferences;
      }
      
      return data as NotificationPreferences;
    },
    enabled: !!userId,
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: Partial<NotificationPreferences>) => {
      if (!userId) throw new Error("User ID is required");

      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        // Update existing preferences
        const { error } = await supabase
          .from("notification_preferences")
          .update(newPreferences)
          .eq("user_id", userId);
        
        if (error) throw error;
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from("notification_preferences")
          .insert({ ...newPreferences, user_id: userId });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_preferences", userId] });
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificación han sido guardadas."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "No se pudieron actualizar las preferencias."
      });
    }
  });

  const sendTestEmail = useMutation({
    mutationFn: async (type: string) => {
      const { data: userResponse } = await supabase.auth.getUser();
      if (!userResponse.user?.email) throw new Error("No email found");

      const response = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: userResponse.user.email,
          type,
          data: {
            amount: 1500,
            category: "Alimentación", 
            description: "Compra de prueba",
            date: new Date().toISOString()
          }
        }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Email de prueba enviado",
        description: "Revisa tu bandeja de entrada."
      });
    },
    onError: (error) => {
      console.error("Error sending test email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo enviar el email de prueba: ${error.message || 'Error desconocido'}`
      });
    }
  });

  return { 
    preferences, 
    isLoading, 
    error: error?.message || null, 
    updatePreferences,
    sendTestEmail
  };
}