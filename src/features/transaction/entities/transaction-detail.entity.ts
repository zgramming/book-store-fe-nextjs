export interface TransactionDetailEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: number;
  student_id: number;
  date_loan: Date;
  date_return: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  TransactionDetail: TransactionDetail[];
}

interface TransactionDetail {
  id: number;
  transaction_id: number;
  book_id: number;
  qty: number;
  status: string;
  book: Book;
}

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  created_at: Date;
  updated_at: Date;
}
