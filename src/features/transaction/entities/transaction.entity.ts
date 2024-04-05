export interface TransactionEntity {
  message: string;
  error: boolean;
  total: number;
  data: Datum[];
}

interface Datum {
  id: number;
  student_id: number;
  date_loan: Date;
  date_return: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  TransactionDetail: TransactionDetail[];
  student: Student;

}

interface TransactionDetail {
  id: number;
  transaction_id: number;
  book_id: number;
  qty: number;
  status: string;
}

interface Student {
  id: number;
  name: string;
  nim: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
