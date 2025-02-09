import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qzpvimekzupdzglqfznv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cHZpbWVrenVwZHpnbHFmem52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTMwNjksImV4cCI6MjA1NDE2OTA2OX0.3EOtFu9caUlAv0-dMyGzZN5OO-2gwmouNBFClYZPRcI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
