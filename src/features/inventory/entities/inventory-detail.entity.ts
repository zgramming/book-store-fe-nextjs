export interface InventoryDetailEntity {
  message: string;
  error: boolean;
  data: Datum;
}

interface Datum {
  id: number;
  book_id: number;
  location: string;
  stock: number;
  created_at: Date;
  updated_at: Date;
}
