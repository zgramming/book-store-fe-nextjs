export interface MasterIconDetailEntity {
  error: boolean;
  message: string;
  data: Datum;
}

interface Datum {
  id: number;
  code: string;
  name: string;
  status: string;
  icon_url: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
