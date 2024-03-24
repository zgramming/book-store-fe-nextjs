import useSWR from 'swr';
import { UserDetailEntity } from './entities/user-detail.entity';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { UserEntity } from './entities/user.entity';
import { http } from '@/utils/http';
import { isNumber } from '@/utils/function';

interface UseListUserProps extends IBaseQueryParams {
  roleId?: string;
}

const url = {
  base: '/user',
};

const hooks = {
  useList: ({ page = 0, pageSize = 100, search, roleId }: UseListUserProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    if (roleId) {
      uri += `&role_id=${roleId}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<UserEntity>(uri, http.fetcher);
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
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<UserDetailEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      isLoading,
      error,
      mutate,
      isValidating,
    };
  },
};

const api = {
  create: (data: UserCreateDTO) => {
    return http.post(`${url.base}`, data, null);
  },
  edit: (id: string, data: UserUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  changePassword: (id: number, newPassword: string) => {
    return http.put(`${url.base}/${id}/change-password`, { password: newPassword }, null);
  },
  delete: (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const UserRepository = {
  url,
  hooks,
  api,
};
