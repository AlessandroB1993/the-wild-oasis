import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://zccdbinicsvmnbpvwnll.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjY2RiaW5pY3N2bW5icHZ3bmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NzA1MjksImV4cCI6MjA1NTU0NjUyOX0.8tvL4cs9BXeLNvlOX1GkvwIC1Ey5T0BBZaWC89W95hc";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
