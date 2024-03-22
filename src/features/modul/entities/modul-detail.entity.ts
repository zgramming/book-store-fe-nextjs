export interface ModulDetailEntity {
  error: boolean;
  message: string;
  data: Datum;
}

interface Datum {
  id: number;
  app_category_modul_id: number;
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
