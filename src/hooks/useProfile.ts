
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, photo_url")
      .eq("id", userId)
      .maybeSingle();

    if (error) setError(error.message);
    else setProfile(data as Profile);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  const updateProfile = async ({
    first_name,
    last_name,
    photo_url,
  }: {
    first_name?: string | null;
    last_name?: string | null;
    photo_url?: string | null;
  }) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, photo_url })
      .eq("id", userId);
    if (error) setError(error.message);
    // Vuelve a traer el perfil actualizado
    await fetchProfile();
    setLoading(false);
  };

  return { profile, loading, error, updateProfile, fetchProfile };
}
