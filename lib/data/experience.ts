import { createPublicClient } from "@/lib/supabase/public";

export async function getAllExperience() {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
