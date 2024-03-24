export interface RoleDetailEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  code: string;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
