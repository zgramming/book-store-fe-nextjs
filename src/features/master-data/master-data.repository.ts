import useSWR from 'swr';
import { MasterDataEntity } from './entities/master-data.entity';
import { MasterDataDetailEntity } from './entities/master-data-detail.entity';
import { MasterDataCreateDTO } from './dto/master-data-create.dto';
import { MasterDataUpdateDTO } from './dto/master-data-update.dto';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { http } from '@/utils/http';
import { isNumber } from '@/utils/function';

interface UseListProps extends IBaseQueryParams {
  master_category_id?: string;
}
const url = {
  base: '/master-data',
};

const hooks = {
  useList({ page = 1, pageSize = 100, search, master_category_id }: UseListProps) {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    if (master_category_id) {
      uri += `&master_category_id=${master_category_id}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<MasterDataEntity>(uri, http.fetcher);

    return {
      data: response?.data ?? [],
      total: response?.total ?? 0,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useById(id?: string) {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<MasterDataDetailEntity>(uri, http.fetcher);

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
  create: (data: MasterDataCreateDTO) => {
    return http.post(`${url.base}`, data, null);
  },
  edit: (id: string, data: MasterDataUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const MasterDataRepository = {
  url,
  hooks,
  api,
};
