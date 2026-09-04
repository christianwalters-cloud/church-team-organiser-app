import { createClient } from '@supabase/supabase-js'

// REMOVED '/rest/v1/' from the end of the URL string
const supabaseUrl = 'https://pwgrxslbvurzkubbqadz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3Z3J4c2xidnVyemt1YmJxYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzMyNTUsImV4cCI6MjEwNDAwOTI1NX0.RqTQD278Sa1r3QDaxGX1fmHaPklvjPXw8oo9i3MnZKg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
