export interface TemplateDokumenEntity {
  error: boolean;
  message: string;
  data: Datum[];
  total: number;
}

interface Datum {
  id: number;
  code: string;
  name: string;
  template: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
