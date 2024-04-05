import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { InventoryEntity } from './entities/inventory.entity';
import { http } from '@/utils/http';
import { InventoryDetailEntity } from './entities/inventory-detail.entity';

interface UseListParams extends IBaseQueryParams {
  title?: string;
  location?: string;
}

interface InventoryCreateDTO {
  book_id: number;
  location: string;
  stock: number;
}

interface InventoryUpdateDTO extends Partial<InventoryCreateDTO> {}

const url = {
  base: '/inventories',
};

const hooks = {
  useList: ({ page = 1, limit = 100, title, location }: UseListParams) => {
    let uri = `${url.base}?page=${page}&limit=${limit}`;

    if (title) {
      uri += `&title=${title}`;
    }

    if (location) {
      uri += `&location=${location}`;
    }

    const { data, error, mutate, isLoading, isValidating } = useSWR<InventoryEntity>(uri, http.fetcher);

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
    const { data, error, mutate, isLoading } = useSWR<InventoryDetailEntity>(uri, http.fetcher);

    return {
      data: data?.data ,
      error,
      mutate,
      isLoading,
    };
  },
};

const api = {
  create: async (data: InventoryCreateDTO) => {
    return http.post(url.base, data, null);
  },
  update: async (id: string, data: InventoryUpdateDTO) => {
    return http.put(`${url.base}/${id}`, data, null);
  },
  delete: async (id: string) => {
    return http.del(`${url.base}/${id}`, null);
  },
  increaseStock: async (id: string, stock: number) => {
    return http.put(`${url.base}/${id}/increase-stock`, { stock }, null);
  },
  decreaseStock: async (id: string, stock: number) => {
    return http.put(`${url.base}/${id}/decrease-stock`, { stock }, null);
  },
};

export const InventoryRepository = {
  hooks,
  api,
};
