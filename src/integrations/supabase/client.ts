// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ippayvhpebkduzpfpbrc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwcGF5dmhwZWJrZHV6cGZwYnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjEyNDksImV4cCI6MjA1NjM5NzI0OX0.-FlPTI6LziAAK10W2sUx3q6kPr9UhM-Q1j8SF2uucBg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);