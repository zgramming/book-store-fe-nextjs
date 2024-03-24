import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { CategoryModulRepository } from '@/features/category-modul/category-modul.repository';
import { ModulRepository } from '@/features/modul/modul.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Select, Group, Button, NumberInput, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Data Badan Usaha">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      app_category_modul_id: undefined as string | undefined,
      icon_id: undefined as string | undefined,
      code: '',
      name: '',
      order: '1',
      status: 'active',
    },
    validate: {
      code: (val) => (val ? null : 'Kode harus diisi'),
      name: (val) => (val ? null : 'Nama harus diisi'),
      order: (val) => (val ? null : 'Urutan harus diisi'),
      status: (val) => (val ? null : 'Status harus diisi'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;

  const { data: modulData, isLoading: categoryLoading } = ModulRepository.hooks.useById(id as string | undefined);

  const { data: categoryData } = CategoryModulRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({
        values,
      });

      const body = {
        app_category_modul_id: +values.app_category_modul_id,
        icon_id: values.icon ? +values.icon : undefined,
        code: values.code,
        name: values.name,
        order: +values.order,
        status: values.status,
        created_by: jwtPayload?.userId || 0,
      };

      if (modulData) {
        await ModulRepository.api.edit(`${modulData.id}`, {
          ...body,
          updated_by: jwtPayload?.userId || 0,
        });
      } else {
        await ModulRepository.api.create(body);
      }

      notifications.show({
        title: 'Success',
        message: `Data berhasil ${modulData ? 'diubah' : 'ditambahkan'}`,
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

    if (modulData) {
      if (modulData.app_category_modul_id) setFieldValue('app_category_modul_id', `${modulData.app_category_modul_id}`);
      if (modulData.icon_id) setFieldValue('icon_id', `${modulData.icon_id}`);
      setFieldValue('code', modulData.code);
      setFieldValue('name', modulData.name);
      setFieldValue('order', `${modulData.order}`);
      setFieldValue('status', modulData.status);
    }

    return () => {};
  }, [isReady, modulData, setFieldValue]);

  return (
    <>
      <LoadingOverlay visible={categoryLoading} />
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
              Form
            </Card.Section>
            <Stack gap={'md'}>
              <Select
                label="Kategori Modul"
                placeholder="Pilih Kategori Modul"
                data={categoryData.map((item) => ({
                  value: `${item.id}`,
                  label: item.name,
                }))}
                searchable
                clearable
                {...form.getInputProps('app_category_modul_id')}
              />

              <TextInput
                placeholder="Masukkan Kode"
                label="Kode"
                name="code"
                withAsterisk
                disabled={!!modulData}
                {...form.getInputProps('code')}
              />
              <TextInput
                placeholder="Masukkan Nama"
                label="Nama"
                name="name"
                withAsterisk
                {...form.getInputProps('name')}
              />
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
