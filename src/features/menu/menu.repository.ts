import useSWR from 'swr';
import { MenuCreateDTO } from './dto/menu-create.dto';
import { MenuUpdateDTO } from './dto/menu-update.dto';
import { MenuEntity } from './entities/menu.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { http } from '@/utils/http';
import { MenuDetailEntity } from './entities/menu-detail.entity';
import { isNumber } from '@/utils/function';

interface UseListProps extends IBaseQueryParams {
  category_modul_id?: string;
  modul_id?: string;
}

const url = {
  base: '/app-menu',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, search, category_modul_id, modul_id }: UseListProps) => {
    let uri = `${url.base}/?page=${page}&limit=${pageSize}`;

    if (search) {
      uri += `&name=${search}`;
    }

    if (category_modul_id) {
      uri += `&category_modul_id=${category_modul_id}`;
    }

    if (modul_id) {
      uri += `&modul_id=${modul_id}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<MenuEntity>(uri, http.fetcher);

    return {
      data: response?.data || [],
      total: response?.total || 0,
      response,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate, isValidating } = useSWR<MenuDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      response,
      error,
      isLoading,
      mutate,
      isValidating,
    };
  },
};

const api = {
  create(data: MenuCreateDTO) {
    return http.post(`${url.base}`, data, null);
  },
  edit(id: string, data: MenuUpdateDTO) {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete(id: string) {
    return http.del(`${url.base}/${id}`, null);
  },
};

export const MenuRepository = {
  url,
  hooks,
  api,
};
