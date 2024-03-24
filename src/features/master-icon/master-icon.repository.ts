import { http } from '@/utils/http';
import useSWR from 'swr';
import { MasterIconEntity } from './entities/master-icon.entity';
import { MasterIconDetailEntity } from './entities/master-icon-detail.entity';
import { MasterIconCreateDTO } from './dto/master-icon-create.dto';
import { MasterIconUpdateDTO } from './dto/master-icon-update.dto';
import { isNumber } from '@/utils/function';

type UserListMasterIconProps = {
  page: number;
  pageSize: number;
  namaIcon?: string;
};

const url = {
  base: '/master-icon',
};

const hooks = {
  useList: ({ page, pageSize, namaIcon }: UserListMasterIconProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;
    if (namaIcon) {
      uri += `&name=${namaIcon}`;
    }

    const { data, error, isLoading, mutate } = useSWR<MasterIconEntity>(uri, http.fetcher);
    return {
      items: data?.data ?? [],
      isLoading,
      error,
      mutate,
    };
  },

  useById: (id?: string) => {
    const uri = id && isNumber(id) ? `${url.base}/${id}` : null;

    const { data: response, error, isLoading, mutate } = useSWR<MasterIconDetailEntity>(uri, http.fetcher);
    const data = response?.data;

    return {
      data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  create: async (body: MasterIconCreateDTO) => {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('code', body.code);
    formData.append('status', body.status);
    formData.append('icon', body.icon);
    formData.append('created_by', body.created_by.toString());

    const result = await http.post(url.base, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result;
  },
  update: async (id: string, body: MasterIconUpdateDTO) => {
    const formData = new FormData();
    formData.append('name', body.name || '');
    formData.append('code', body.code || '');
    formData.append('status', body.status || '');
    if (body.icon) {
      formData.append('icon', body.icon);
    }
    formData.append('updated_by', body.updated_by.toString());

    const result = await http.put(`${url.base}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result;
  },
  delete: (id: string) => http.del(`${url.base}/${id}`, null),
};

export const MasterIconRepository = {
  url,
  hooks,
  api,
};
