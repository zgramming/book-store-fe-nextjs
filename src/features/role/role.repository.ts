import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { RoleEntity } from './entities/role.entity';
import { http } from '@/utils/http';
import { RoleForAppModulEntity } from './entities/role-for-app-modul.entity';
import { RoleForAppMenuEntity } from './entities/role-for-app-menu.entity';
import { RoleDetailEntity } from './entities/role-detail.entity';
import { RoleCreateDTO } from './dto/role-create.dto';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { isNumber } from '@/utils/function';

interface UseListRoleProps extends IBaseQueryParams {}

interface UseListRoleForAppMenuProps {
  id?: string;
  categoryId?: string;
}

const url = {
  base: '/role',
  basedForAppModul: (id: string) => `/role/for_app_module/${id}`,
  basedForAppMenu: (id: string, categoryId?: string) => {
    let url = `/role/for_app_menu/${id}`;

    if (categoryId) {
      url = `${url}?categoryId=${categoryId}`;
    }
    return url;
  },
  basedForAccessModul: `/role/access_module`,
  basedForAccessMenu: `/role/access_menu`,
};

const hooks = {
  useList: ({ page = 0, pageSize = 100, search }: UseListRoleProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<RoleEntity>(uri, http.fetcher);
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
  useListForAppModul: (roleId?: string) => {
    const uri = roleId ? url.basedForAppModul(roleId) : null;
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<RoleForAppModulEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  useListForAppMenu: ({ id, categoryId }: UseListRoleForAppMenuProps) => {
    const uri = id && categoryId ? url.basedForAppMenu(id, categoryId) : null;
    const { data: response, error, mutate, isLoading, isValidating } = useSWR<RoleForAppMenuEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      mutate,
      isLoading,
      isValidating,
    };
  },

  useById: (id?: string) => {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;
    const { data: response, error, mutate, isLoading, isValidating } = useSWR<RoleDetailEntity>(uri, http.fetcher);

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
  create(data: RoleCreateDTO) {
    return http.post(url.base, data, null);
  },
  updateAccessModule(data: any) {
    return http.post(url.basedForAccessModul, data, null);
  },
  updateAccessMenu(data: any) {
    return http.post(url.basedForAccessMenu, data, null);
  },
  edit(id: string, data: RoleUpdateDTO) {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete(id: string) {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const RoleRepository = {
  url,
  hooks,
  api,
};
