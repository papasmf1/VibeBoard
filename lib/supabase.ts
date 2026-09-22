import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is properly configured with valid values
const isValidSupabaseUrl = (url?: string) => {
  return url && url.startsWith('https://') && !url.includes('your_supabase')
}

const isValidSupabaseKey = (key?: string) => {
  return key && key.length > 10 && !key.includes('your_')
}

export const isSupabaseConfigured = () => {
  return isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseKey)
}

let supabaseClient: ReturnType<typeof createClient> | null = null

if (isSupabaseConfigured()) {
  supabaseClient = createClient(supabaseUrl!, supabaseKey!)
}

export const supabase = supabaseClient
