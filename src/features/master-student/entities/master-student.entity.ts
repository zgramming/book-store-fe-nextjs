export interface MasterStudentEntity {
  message: string;
  error: boolean;
  total: number;
  data: Datum[];
}

interface Datum {
  id: number;
  name: string;
  nim: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
