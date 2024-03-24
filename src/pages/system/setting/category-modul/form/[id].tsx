import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { CategoryModulRepository } from '@/features/category-modul/category-modul.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, NumberInput, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Category Modul">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);

  const form = useForm({
    initialValues: {
      icon_id: undefined as number | undefined,
      code: '',
      name: '',
      order: '1',
      status: 'active',
    },
    validate: {
      code: (value) => (value ? null : 'Kode tidak boleh kosong'),
      name: (value) => (value ? null : 'Nama tidak boleh kosong'),
      order: (value) => (value ? null : 'Urutan tidak boleh kosong'),
      status: (value) => (value ? null : 'Status tidak boleh kosong'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataModulCategory, isLoading: isLoadingModulCategory } = CategoryModulRepository.hooks.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (dataModulCategory) {
        await CategoryModulRepository.api.edit(`${dataModulCategory.id}`, {
          icon_id: dataModulCategory.icon_id,
          code: values.code,
          name: values.name,
          order: +values.order,
          status: values.status,
          updated_by: jwtPayload?.userId || 0,
        });
      } else {
        await CategoryModulRepository.api.create({
          icon_id: undefined,
          code: values.code,
          name: values.name,
          order: +values.order,
          status: values.status,
          created_by: jwtPayload?.userId || 0,
        });
      }

      notifications.show({
        title: 'Berhasil',
        message: `Data berhasil ${isEdit ? 'diubah' : 'ditambahkan'}`,
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

    if (dataModulCategory) {
      setFieldValue('code', dataModulCategory.code);
      setFieldValue('name', dataModulCategory.name);
      setFieldValue('order', `${dataModulCategory.order}`);
      setFieldValue('status', dataModulCategory.status);
    }

    return () => {};
  }, [dataModulCategory, isReady, setFieldValue]);

  return (
    <>
      <LoadingOverlay visible={isLoadingModulCategory} />
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
              <TextInput
                placeholder="Masukkan Kode"
                label="Kode"
                name="code"
                withAsterisk
                disabled={dataModulCategory !== undefined}
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
