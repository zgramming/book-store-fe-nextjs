export interface UserDetailEntity {
  error: boolean;
  message: string;
  data: Datum;
}

interface Datum {
  id: number;
  role_id: number;
  name: string;
  email?: string;
  username: string;
  password: string;
  status: string;
  phone?: string;
  image?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
