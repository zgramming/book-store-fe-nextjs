import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { TransactionEntity } from './entities/transaction.entity';
import useSWR from 'swr';
import { http } from '@/utils/http';
import { TransactionDetailEntity } from './entities/transaction-detail.entity';

interface UseListParams extends IBaseQueryParams {
  student_name?: string;
  date_loan?: Date;
  date_return?: Date;
}

interface TransactionCreateDTO {
  student_id: number;
  date_loan: string;
  date_return: string;
  items: {
    book_id: number;
    quantity: number;
  }[];
}

const url = {
  base: '/transactions',
};

const hooks = {
  useList: ({ page = 1, limit = 100, student_name, date_loan, date_return }: UseListParams) => {
    let uri = `${url.base}?page=${page}&limit=${limit}`;

    if (student_name) {
      uri += `&student_name=${student_name}`;
    }

    if (date_loan) {
      uri += `&date_loan=${date_loan}`;
    }

    if (date_return) {
      uri += `&date_return=${date_return}`;
    }

    const { data, error, mutate, isLoading, isValidating } = useSWR<TransactionEntity>(uri, http.fetcher);

    return {
      data: data?.data || [],
      total: data?.total || 0,
      error,
      mutate,
      isLoading,
      isValidating,
    };
  },
  useDetail: (id?: number) => {
    const uri = id ? `${url.base}/${id}` : null;
    const { data, error, mutate, isValidating, isLoading } = useSWR<TransactionDetailEntity>(uri, http.fetcher);

    return {
      data: data?.data,
      error,
      mutate,
      isValidating,
      isLoading,
    };
  },
};

const api = {
  create: async (data: TransactionCreateDTO) => {
    return http.post(url.base, data, null);
  },
  returnBook: async (id: string) => {
    return http.put(`${url.base}/${id}/return`, null, null);
  },
};

export const TransactionRepository = {
  hooks,
  api,
};
