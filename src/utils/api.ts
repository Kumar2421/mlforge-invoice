import { createClient } from './supabase/client';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': session ? `Bearer ${session.access_token}` : '',
  };
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }
  
  return response.json();
};
