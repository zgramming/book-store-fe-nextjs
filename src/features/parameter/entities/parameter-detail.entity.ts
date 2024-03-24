export interface ParameterDetailEntity {
  error: boolean;
  message: string;
  data: Datum;
}

interface Datum {
  id: number;
  name: string;
  code: string;
  value: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
