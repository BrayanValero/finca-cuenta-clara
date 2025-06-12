
import { supabase } from '@/integrations/supabase/client';

export interface UserSession {
  id: string;
  user_id: string;
  login_time: string;
  user_email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const sessionService = {
  // Create a new session record when user logs in
  async createSession(userId: string, userEmail: string) {
    try {
      // Get user's IP address (best effort)
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        console.log('Could not get IP address:', error);
      }

      const sessionData = {
        user_id: userId,
        user_email: userEmail,
        ip_address: ipAddress,
        user_agent: navigator.userAgent,
        login_time: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createSession:', error);
      return null;
    }
  },

  // Get the last session for the current user
  async getLastSession(): Promise<UserSession | null> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching last session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLastSession:', error);
      return null;
    }
  },

  // Get all sessions for the current user
  async getUserSessions(limit: number = 10): Promise<UserSession[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserSessions:', error);
      return [];
    }
  }
};
