import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { MasterCategoryRepository } from '@/features/master-category/master-category.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Category">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      master_category_parent_id: undefined as string | undefined,
      code: '',
      name: '',
      description: '',
      status: 'active',
    },
    validate: {
      code: (value) => (value.trim().length === 0 ? 'Kode tidak boleh kosong' : undefined),
      name: (value) => (value.trim().length === 0 ? 'Nama tidak boleh kosong' : undefined),
      status: (value) => (value.trim().length === 0 ? 'Status tidak boleh kosong' : undefined),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataMasterCategory } = MasterCategoryRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });
      const body = {
        master_category_parent_id: values.master_category_parent_id ? values.master_category_parent_id : undefined,
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        created_by: jwtPayload?.userId || 0,
      };

      if (dataMasterCategory) {
        await MasterCategoryRepository.api.edit(`${dataMasterCategory.id}`, {
          ...body,
          updated_by: jwtPayload?.userId || 0,
        });
      } else {
        await MasterCategoryRepository.api.create(body);
      }

      notifications.show({
        title: 'Success',
        message: `Data berhasil ${dataMasterCategory ? 'diubah' : 'ditambahkan'}`,
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

    if (dataMasterCategory) {
      setFieldValue('code', dataMasterCategory.code);
      setFieldValue('name', dataMasterCategory.name);
      if (dataMasterCategory.description) setFieldValue('description', dataMasterCategory.description);
      setFieldValue('status', dataMasterCategory.status);
    }

    return () => {};
  }, [dataMasterCategory, isReady, setFieldValue]);

  return (
    <>
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
              <TextInput label="Kode" placeholder="Kode" {...form.getInputProps('code')} />
              <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('name')} />
              <Textarea label="Keterangan" placeholder="Keterangan" {...form.getInputProps('description')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
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
