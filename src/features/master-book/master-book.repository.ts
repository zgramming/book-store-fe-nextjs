import { http } from '@/utils/http';
import useSWR from 'swr';
import { MasterBookEntity } from './entities/master-book.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { MasterBookDetailEntity } from './entities/master-book-detail.entity';

interface UseListParams extends IBaseQueryParams {
  title?: string;
}
interface MasterBookCreateDTO {
  title: string;
  author: string;
  publisher: string;
  year: number;
}
interface MasterBookUpdateDTO extends Partial<MasterBookCreateDTO> {}

const url = {
  base: '/master-books',
};

const hooks = {
  useList: ({ page = 1, limit = 100, title }: UseListParams) => {
    let uri = `${url.base}?page=${page}&limit=${limit}`;

    if (title) {
      uri += `&title=${title}`;
    }

    const { data, error, mutate, isLoading, isValidating } = useSWR<MasterBookEntity>(uri, http.fetcher);

    return {
      data: data?.data || [],
      total: data?.total || 0,
      error,
      mutate,
      isLoading,
      isValidating,
    };
  },

  useById: (id?: string) => {
    const uri = id ? `${url.base}/${id}` : null;
    const { data, error, mutate, isLoading } = useSWR<MasterBookDetailEntity>(uri, http.fetcher);

    return {
      data: data?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  create: async (data: MasterBookCreateDTO) => {
    return http.post(url.base, data, null);
  },
  update: async (id: string, data: MasterBookUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: async (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const MasterBookRepository = {
  hooks,
  api,
};
