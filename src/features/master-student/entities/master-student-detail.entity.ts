export interface MasterStudentDetailEntity {
  message: string;
  error: boolean;
  data: Datum;
}

interface Datum {
  id: number;
  name: string;
  nim: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
