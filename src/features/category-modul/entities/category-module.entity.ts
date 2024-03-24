export interface CategoryModulEntity {
  error: boolean;
  message: string;
  data: Datum[];
  total: number;
}

interface Datum {
  id: number;
  icon_id?: number;
  code: string;
  name: string;
  order: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
