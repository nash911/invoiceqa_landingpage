export interface LeadFormData {
  email: string;
  role?: string;
  accounting_system?: string;
  invoices_per_month?: string;
  country?: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadSubmission extends LeadFormData {
  utm: UTMParams;
}

export interface LeadResponse {
  ok: boolean;
  duplicate?: boolean;
  error?: string;
}
