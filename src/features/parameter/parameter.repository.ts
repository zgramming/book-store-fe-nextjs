import useSWR from 'swr';
import { ParameterEntity } from './entities/parameter.entity';
import { ParameterDetailEntity } from './entities/parameter-detail.entity';
import { ParameterCreateDTO } from './dto/parameter-create.dto';
import { ParameterUpdateDTO } from './dto/parameter-update-dto';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { http } from '@/utils/http';
import { isNumber } from '@/utils/function';

interface UseListParameterProps extends IBaseQueryParams {}

const url = {
  base: '/parameter',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, search }: UseListParameterProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ParameterEntity>(uri, http.fetcher);
    return {
      data: response?.data ?? [],
      total: response?.total ?? 0,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ParameterDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
};

const api = {
  create: (data: ParameterCreateDTO) => {
    return http.post(`${url.base}`, data, null);
  },
  edit: (id: string, data: ParameterUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const ParameterRepository = {
  url,
  hooks,
  api,
};
