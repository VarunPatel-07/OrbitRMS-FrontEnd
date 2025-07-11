export interface ClientInquiry {
  api_key: string;
  api_secrete: string;
  id: string;
  organization_id: string;
  status: boolean;
}

export interface ClientInquiryFormSchemaInterface {
  id: string;
  config_module_id: string;
  field_name: string;
  type: string;
  is_required_field: boolean;
  source_type: string;
  created_at: string; // ISO date string
  updated_at: string | null;
  created_by: string;
  updated_by: string | null;
}
