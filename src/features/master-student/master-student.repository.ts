import { http } from '@/utils/http';
import useSWR from 'swr';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { MasterStudentEntity } from './entities/master-student.entity';
import { MasterStudentDetailEntity } from './entities/master-student-detail.entity';

interface UseListParams extends IBaseQueryParams {
  name?: string;
}
interface MasterStudentCreateDTO {
  name: string;
  nim: string;
  status: string;
}
interface MasterStudentUpdateDTO extends Partial<MasterStudentCreateDTO> {}

const url = {
  base: '/master-students',
};

const hooks = {
  useList: ({ page = 1, limit = 100, name }: UseListParams) => {
    let uri = `${url.base}?page=${page}&limit=${limit}`;

    if (name) {
      uri += `&name=${name}`;
    }

    const { data, error, mutate, isLoading, isValidating } = useSWR<MasterStudentEntity>(uri, http.fetcher);

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
    const { data, error, mutate, isLoading } = useSWR<MasterStudentDetailEntity>(uri, http.fetcher);

    return {
      data: data?.data,
      error,
      mutate,
      isLoading,
    };
  },
};

const api = {
  create: async (data: MasterStudentCreateDTO) => {
    return http.post(url.base, data, null);
  },
  update: async (id: string, data: MasterStudentUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: async (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const MasterStudentRepository = {
  hooks,
  api,
};
