import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { CategoryModulRepository } from '@/features/category-modul/category-modul.repository';
import { MenuRepository } from '@/features/menu/menu.repository';
import { ModulRepository } from '@/features/modul/modul.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Select, Group, Button, NumberInput, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Menu">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      app_menu_id_parent: undefined as string | undefined,
      app_category_modul_id: undefined as string | undefined,
      app_modul_id: undefined as string | undefined,
      icon_id: undefined as string | undefined,
      code: '',
      name: '',
      route: '',
      order: '1',
      status: 'active',
    },
    validate: {
      app_category_modul_id: (value) => (value ? null : 'Kategori Modul harus diisi'),
      app_modul_id: (value) => (value ? null : 'Modul harus diisi'),
      name: (value) => (value ? null : 'Nama harus diisi'),
      code: (value) => (value ? null : 'Kode harus diisi'),
      route: (value) => (value ? null : 'Route harus diisi'),
      order: (value) => (value ? null : 'Urutan harus diisi'),
      status: (value) => (value ? null : 'Status harus diisi'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue, values } = form;

  const { data: dataMenu, isLoading: isLoadingMenu } = MenuRepository.hooks.useById(id as string | undefined);
  const { data: categoryModulData } = CategoryModulRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });
  const { data: dataModul } = ModulRepository.hooks.useByCategoryModul(values.app_category_modul_id);
  const { data: dataMenuUtama = [] } = MenuRepository.hooks.useList({
    page: 1,
    pageSize: 1000,
    modul_id: values.app_modul_id,
  });

  const menuWithoutChild = dataMenuUtama.filter((item) => item.app_menu_id_parent === null);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      const body = {
        app_menu_id_parent: values.app_menu_id_parent ? +values.app_menu_id_parent : undefined,
        app_modul_id: +values.app_modul_id,
        code: values.code,
        name: values.name,
        order: +values.order,
        route: values.route,
        status: values.status,
        icon_id: values.icon_id,
        created_by: jwtPayload?.userId ?? 0,
      };

      if (dataMenu) {
        await MenuRepository.api.edit(`${dataMenu.id}`, {
          ...body,
          updated_by: jwtPayload?.userId ?? 0,
        });
      } else {
        await MenuRepository.api.create(body);
      }

      notifications.show({
        title: 'Success',
        message: `Data berhasil ${dataMenu ? 'diubah' : 'ditambahkan'}`,
        color: 'green',
      });

      back();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (dataMenu) {
      if (dataMenu.app_menu_id_parent) {
        setFieldValue('app_menu_id_parent', `${dataMenu.app_menu_id_parent}`);
      }
      setFieldValue('app_category_modul_id', `${dataMenu.app_category_modul_id}`);
      setFieldValue('app_modul_id', `${dataMenu.app_modul_id}`);
      if (dataMenu.icon_id) {
        setFieldValue('icon_id', `${dataMenu.icon_id}`);
      }
      setFieldValue('code', dataMenu.code);
      setFieldValue('name', dataMenu.name);
      setFieldValue('route', dataMenu.route);
      setFieldValue('order', `${dataMenu.order}`);
      setFieldValue('status', dataMenu.status);
    }

    return () => {};
  }, [dataMenu, isReady, setFieldValue]);

  return (
    <>
      <LoadingOverlay visible={isLoadingMenu} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'xl'}>
          <Card withBorder>
            <Group justify="right">
              <Button onClick={back} variant="default">
                Kembali
              </Button>
              <Button type="submit">Simpan</Button>
            </Group>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Card Section
            </Card.Section>
            <Stack gap={'md'}>
              <Select
                label="Kategori Modul"
                placeholder="Pilih Kategori Modul"
                data={categoryModulData.map((item) => ({
                  value: `${item.id}`,
                  label: item.name,
                }))}
                nothingFoundMessage="No options"
                searchable
                clearable
                {...form.getInputProps('app_category_modul_id')}
              />
              <Select
                key={values.app_category_modul_id || 'kategori_modul'}
                label="Modul"
                placeholder="Pilih Modul"
                data={dataModul.map((item) => ({
                  value: `${item.id}`,
                  label: item.name,
                }))}
                nothingFoundMessage="No options"
                searchable
                clearable
                {...form.getInputProps('app_modul_id')}
              />
              <Select
                key={values.app_modul_id || 'modul'}
                label="Menu Utama"
                placeholder="Pilih Menu Utama"
                data={menuWithoutChild.map((item) => ({
                  value: `${item.id}`,
                  label: item.name,
                }))}
                nothingFoundMessage="No options"
                searchable
                clearable
                {...form.getInputProps('app_menu_id_parent')}
              />
              <TextInput label="Kode" placeholder="Kode" {...form.getInputProps('code')} />
              <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('name')} />
              <TextInput label="Route" placeholder="Route" {...form.getInputProps('route')} />
              <NumberInput placeholder="Masukkan Urutan" label="Urutan" name="order" {...form.getInputProps('order')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group pt={'sm'}>
                  <Radio value="active" label="Aktif" />
                  <Radio value="inactive" label="Tidak Aktif" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
