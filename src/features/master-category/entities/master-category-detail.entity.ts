export interface MasterCategoryDetailEntity {
  error: boolean;
  meessage: string;
  data: Datum;
}

interface Datum {
  id: number;
  master_category_parent_id?: number;
  code: string;
  name: string;
  description: null;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
