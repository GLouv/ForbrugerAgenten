/**
 * TypeScript types for ForbrugerAgenten (Unified Platform)
 */

export type Category = 'energy' | 'mobile' | 'internet';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  auth0_user_id?: string;
  
  // Identity
  agent_email?: string;
  forward_marketing_emails: boolean;
  forward_essential_emails: boolean;
  
  onboarding_completed: boolean;
  onboarding_step: string;
  consent_given: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  user_id: string;
  
  category: Category;
  provider: string;
  name?: string;
  
  monthly_price: number;
  currency: string;
  
  details?: Record<string, any>;
  
  start_date?: string;
  end_date?: string;
  binding_period_months?: number;
  
  status: 'active' | 'pending_switch' | 'cancelled';
  
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_request_id?: string;
  user_id: string;
  
  category: Category;
  provider: string;
  product_name?: string;
  
  monthly_price: number;
  creation_fee: number;
  annual_price?: number;
  
  estimated_annual_savings?: number;
  
  details?: Record<string, any>;
  commission_amount?: number;
  
  // Badges
  is_cheapest: boolean;
  is_best_value: boolean;
  is_recommended: boolean;
  recommendation_reason?: string;
  
  status: 'received' | 'accepted' | 'rejected' | 'expired';
  valid_until?: string;
  
  created_at: string;
}

export interface Provider {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
  categories: Category[];
  is_active: boolean;
}

export interface QuoteRequest {
  id: string;
  user_id: string;
  categories: Category[];
  user_data?: Record<string, any>;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'responses_received' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Spot Prices (V1.5)
export interface SpotPrice {
  id: string;
  area: string;
  timestamp: string;
  price_dkk_per_kwh: number;
}
