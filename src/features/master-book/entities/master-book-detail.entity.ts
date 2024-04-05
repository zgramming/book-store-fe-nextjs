export interface MasterBookDetailEntity {
  message: string;
  error: boolean;
  data: Datum;
}

interface Datum {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  created_at: Date;
  updated_at: Date;
}
