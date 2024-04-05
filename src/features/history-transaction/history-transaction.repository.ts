import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { HistoryTransactionEntity } from './entities/history-transaction.entity';
import useSWR from 'swr';
import { http } from '@/utils/http';

interface UseListParams extends IBaseQueryParams {
  nim?: string;
  name_student?: string;
  book_id?: string;
  book_title?: string;
  date_loan?: Date;
  date_return?: Date;
  long_loan_in_days?: number;
}

const url = {
  base: '/history-transactions',
};

const hooks = {
  useList: async ({
    page = 1,
    limit = 100,
    nim,
    name_student,
    book_id,
    book_title,
    date_loan,
    date_return,
    long_loan_in_days,
  }: UseListParams) => {
    let uri = `${url.base}?page=${page}&limit=${limit}`;

    if (nim) {
      uri += `&nim=${nim}`;
    }

    if (name_student) {
      uri += `&name_student=${name_student}`;
    }

    if (book_id) {
      uri += `&book_id=${book_id}`;
    }

    if (book_title) {
      uri += `&book_title=${book_title}`;
    }

    if (date_loan) {
      uri += `&date_loan=${date_loan}`;
    }

    if (date_return) {
      uri += `&date_return=${date_return}`;
    }

    if (long_loan_in_days) {
      uri += `&long_loan_in_days=${long_loan_in_days}`;
    }

    const { data, error, mutate, isLoading, isValidating } = useSWR<HistoryTransactionEntity>(uri, http.fetcher);

    return {
      data: data?.data || [],
      total: data?.total || 0,
      error,
      mutate,
      isLoading,
      isValidating,
    };
  },
};

const api = {};

export { url, hooks, api };
