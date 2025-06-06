import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wxwsbskbuntwlbmdeayc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d3Nic2tidW50d2xibWRlYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMDQxMjQsImV4cCI6MjA2NDc4MDEyNH0.gQwSsVsgYoiq_ix_OoxhnYyjC9l6S7oBq5SpuXBp5M4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
