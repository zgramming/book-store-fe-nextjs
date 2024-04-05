export interface MasterBookEntity {
  message: string;
  error: boolean;
  total: number;
  data: Datum[];
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
