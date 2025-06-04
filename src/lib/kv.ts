import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const pid = process.env.NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID!;
export const kv = {
  get: async (key: string): Promise<any> => {
    // kv_get returns JSONB, which Supabase surfaces as a JavaScript object/primitive
    const { data, error } = await supabase.rpc("kv_get", { pid, k: key });
    if (error) throw error;
    return data; // JSONB value or null
  },

  set: async (key: string, v: any): Promise<void> => {
    // kv_set takes a JSONB argument; if v is a JS primitive/object, Supabase auto‐converts it
    const { error } = await supabase.rpc("kv_set", { pid, k: key, v });
    if (error) throw error;
  },

  incr: async (key: string, delta = 1): Promise<number> => {
    // kv_incr returns an INT (JavaScript number)
    const { data, error } = await supabase.rpc("kv_incr", {
      pid,
      k: key,
      delta,
    });
    if (error) throw error;
    return data as number;
  },

  append: async (key: string, elem: any): Promise<any> => {
    // kv_append returns the updated JSONB array
    const { data, error } = await supabase.rpc("kv_append", {
      pid,
      k: key,
      elem,
    });
    if (error) throw error;
    return data as any;
  },

  merge: async (key: string, patch: object): Promise<any> => {
    // kv_merge returns the merged JSONB object
    const { data, error } = await supabase.rpc("kv_merge", {
      pid,
      k: key,
      patch,
    });
    if (error) throw error;
    return data as any;
  },
};
