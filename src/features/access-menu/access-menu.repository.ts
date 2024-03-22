import { http } from '@/utils/http';
import useSWR from 'swr';
import { AccessMenuByRoleAndCategoryModulEntity } from './entities/access-menu-by-role-and-category-modul.entity';
import { AccessMenuCreateDTO } from './dto/access-menu-create.dto';

const url = {
  base: '/app-access-menu',
};

const hooks = {
  useByRoleAndCategoryModul: (roleId?: string, categoryModulId?: string) => {
    const uri = categoryModulId && roleId ? `${url.base}/by-role/${roleId}/category-modul/${categoryModulId}` : null;

    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AccessMenuByRoleAndCategoryModulEntity>(uri, http.fetcher);

    const accessibleModul = response?.data?.accessible_modul ?? [];
    const selectedAccessMenu = response?.data?.selected_access_menu ?? [];
    return {
      data: {
        accessibleModul,
        selectedAccessMenu,
      },
      error,
      isLoading,
      isValidating,
      refresh: mutate,
    };
  },
};

const api = {
  create: (data: AccessMenuCreateDTO[]) => {
    return http.post(url.base, data, null);
  },
};

export const AccessMenuRepository = {
  url,
  hooks,
  api,
};
