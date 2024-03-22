import useSWR from 'swr';
import { MasterCategoryDetailEntity } from './entities/master-category-detail.entity';
import { MasterCategoryEntity } from './entities/master-category.entity';
import { MasterCategoryCreateDTO } from './dto/master-category-create.dto';
import { MasterCategoryUpdateDTO } from './dto/master-category-update.dto';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { http } from '@/utils/http';

interface UseListProps extends IBaseQueryParams {}

const url = {
  base: '/master-category',
};

const hooks = {
  useList: ({ page, pageSize, search }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    const { data: response, error, isValidating, isLoading, mutate } = useSWR<MasterCategoryEntity>(uri, http.fetcher);
    return {
      data: response?.data || [],
      total: response?.total || 0,
      isLoading,
      error,
      isValidating,
      mutate,
    };
  },
  useById(id?: string) {
    const uri = id ? `${url.base}/${id}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<MasterCategoryDetailEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      isLoading,
      error,
      isValidating,
      mutate,
    };
  },
};

const api = {
  create: (data: MasterCategoryCreateDTO) => {
    return http.post(`${url.base}`, data, null);
  },
  edit: (id: string, data: MasterCategoryUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const MasterCategoryRepository = {
  url,
  hooks,
  api,
};
