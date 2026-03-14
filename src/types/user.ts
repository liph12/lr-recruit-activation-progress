type AccountType = "national" | "international";
type Confirmation = "yes" | "no" | "disapproved" | null;

export interface Sponsor {
  id: number;
  name: string;
  email: string;
  agent_id: number;
  mobile: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  agent_id: number;
  mobile: string;
  state: string;
  city: string;
  civil_status: string;
  photo: string | null;
  account_type: AccountType;
  webinar_progress: number;
  confirmation: Confirmation;
  uploaded_attendance: string | null;
  certificates_count: number;
  sponsor: Sponsor;
}
