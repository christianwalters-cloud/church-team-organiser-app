import { createClient } from '@supabase/supabase-js'

// 🔐 Safely load configurations from your local .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize the single, shared client instance for the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
