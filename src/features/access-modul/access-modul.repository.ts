import { http } from '@/utils/http';
import { AccessModulCreateDTO } from './dto/access-modul-create.dto';
import { isNumber } from '@/utils/function';
import useSWR from 'swr';
import { AccessModulByRoleEntity } from './entities/access-modul-by-role.entity';

const url = {
  base: '/app-access-modul',
};

const hooks = {
  useByRole(roleId?: string) {
    const uri = roleId && isNumber(roleId) ? `${url.base}/by-role/${roleId}` : undefined;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AccessModulByRoleEntity>(uri, http.fetcher);

    return {
      data: {
        dataExists: response?.dataExist ?? [],
        dataNotExists: response?.dataNotExist ?? [],
      },
      error,
      isLoading,
      isValidating,
      refresh: mutate,
    };
  },
};

const api = {
  create(data: AccessModulCreateDTO[]) {
    return http.post(`${url.base}/create-bulk`, data, null);
  },
};

export const AccessModulRepository = {
  url,
  hooks,
  api,
};
