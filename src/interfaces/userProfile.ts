export interface UserProfile {
  size_of_company: number;
  current_model: string | null;
  business_model: 'B2B' | 'B2C';
  type_of_data: string;
  amount_of_latency: number | null;
  data_sensitivity: 'low' | 'medium' | 'high' | 'critical';
  savings: number;
};