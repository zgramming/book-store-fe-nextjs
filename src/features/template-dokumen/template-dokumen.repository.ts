import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { http } from '@/utils/http';
import { isNumber } from '@/utils/function';
import { TemplateDokumenDetailEntity } from './entities/template-dokumen-detail.entity';
import { TemplateDokumenEntity } from './entities/template-dokumen.entity';
import { TemplateDokumenCreateDTO } from './dto/template-dokumen-create.dto';
import { TemplateDokumenUpdateDTO } from './dto/template-dokumen-update.dto';

interface UseListRoleProps extends IBaseQueryParams {}

const url = {
  base: '/template-dokumen',
};

const hooks = {
  useList: ({ page = 0, pageSize = 100, search }: UseListRoleProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<TemplateDokumenEntity>(uri, http.fetcher);
    const data = response?.data ?? [];

    return {
      total: response?.total ?? 0,
      data: data ?? [],
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
      mutate,
      isLoading,
      isValidating,
    } = useSWR<TemplateDokumenDetailEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      mutate,
      isLoading,
      isValidating,
    };
  },
};

const api = {
  create(data: TemplateDokumenCreateDTO) {
    return http.post(url.base, data, null);
  },
  edit(id: string, data: TemplateDokumenUpdateDTO) {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete(id: string) {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const TemplateDokumenRepository = {
  url,
  hooks,
  api,
};
