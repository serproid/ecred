import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://iprumnyfjbrpnqiwxscm.supabase.co'

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'sb_publishable_9C9i4T17Q8qQLbUH18QEow_ddDrILUp'

export const supabase = createClient(supabaseUrl, supabaseKey)
