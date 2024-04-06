export interface InventoryEntity {
  message: string;
  error: boolean;
  total: number;
  data: Datum[];
}

interface Datum {
  id: number;
  book_id: number;
  location: string;
  stock: number;
  created_at: Date;
  updated_at: Date;
  book: Book;
  current_stock: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
}
