import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://rjslppmodabnwtkktgrw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqc2xwcG1vZGFibnd0a2t0Z3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODA4MzgsImV4cCI6MjA3MjY1NjgzOH0.vBhaPlWkNzolo88nTxzH4JpbiAbK1W_FAen4jbiGZHw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
