import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cyixqgkqzaenambfivdd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aXhxZ2txemFlbmFtYmZpdmRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3Nzg1MjIsImV4cCI6MjAyNjM1NDUyMn0.fHDIsUshcHSri8HnxEUsj6miB56aUyu2Y_KfqhDJtdU";

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
