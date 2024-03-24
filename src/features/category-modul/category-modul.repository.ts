import useSWR from 'swr';
import { CategoryModulCreateDTO } from './dto/category-modul-create.dto';
import { CategoryModulUpdateDto } from './dto/category-modul-update.dto';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { CategoryModulEntity } from './entities/category-module.entity';
import { CategoryModulDetailEntity } from './entities/category-module-detail.entity';
import { http } from '@/utils/http';
import { isNumber } from '@/utils/function';

interface UseListProps extends IBaseQueryParams {}

const url = {
  base: '/app-category-modul',
};

const hooks = {
  useList: ({ page = 0, pageSize = 100, search }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<CategoryModulEntity>(uri, http.fetcher);
    const data = response?.data ?? [];

    return {
      total: response?.total ?? 0,
      data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<CategoryModulDetailEntity>(uri, http.fetcher);

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
  create: (data: CategoryModulCreateDTO) => {
    return http.post(`${url.base}`, data, null);
  },
  edit: (id: string, data: CategoryModulUpdateDto) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const CategoryModulRepository = {
  url,
  hooks,
  api,
};
