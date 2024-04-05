export interface HistoryTransactionEntity {
  message: string;
  error: boolean;
  total: number;
  data: Datum[];
}

interface Datum {
  id: number;
  transaction_id: number;
  book_id: number;
  student_id: number;
  qty: number;
  status: string;
  duration_loan_days: number;
  created_at: Date;
  updated_at: Date;
  student: Student;
  book: Book;
  transaction: Transaction;
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

interface Student {
  id: number;
  name: string;
  nim: string;
  status: string;
}

interface Transaction {
  id: number;
  student_id: number;
  date_loan: Date;
  date_return: Date;
  status: string;
}
