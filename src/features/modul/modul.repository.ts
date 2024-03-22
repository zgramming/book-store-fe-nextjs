import useSWR from 'swr';
import { ModulDetailEntity } from './entities/modul-detail.entity';
import { ModulCreateDTO } from './dto/modul-create.dto';
import { ModulUpdateDTO } from './dto/modul-updatee.dto';
import { ModulEntity } from './entities/modul.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { http } from '@/utils/http';
import { isNumber } from '@/utils/function';

interface UseListProps extends IBaseQueryParams {
  categoryModulId?: string;
}

const url = {
  base: '/app-modul',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, categoryModulId, search }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (categoryModulId) {
      uri += `&category_modul_id=${categoryModulId}`;
    }

    if (search) {
      uri += `&name=${search}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ModulEntity>(uri, http.fetcher);

    return {
      data: response?.data || [],
      total: response?.total || 0,
      response,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useByCategoryModul: (kategoriModul?: string) => {
    const page = 1;
    const pageSize = kategoriModul ? 1000 : 0;
    const uri = !kategoriModul
      ? undefined
      : `${url.base}?page=${page}&limit=${pageSize}&category_modul_id=${kategoriModul}`;

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ModulEntity>(uri, http.fetcher);

    return {
      data: response?.data || [],
      total: response?.total || 0,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ModulDetailEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      response,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
};

const api = {
  create: (data: ModulCreateDTO) => {
    return http.post(`${url.base}`, data, null);
  },
  edit: (id: string, data: ModulUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const ModulRepository = {
  url,
  hooks,
  api,
};
