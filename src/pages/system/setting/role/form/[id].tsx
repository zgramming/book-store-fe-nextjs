import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { RoleRepository } from '@/features/role/role.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Role">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      status: 'active',
    },
    validate: {
      code: (value) => {
        if (value.trim().length === 0) return 'Kode tidak boleh kosong';
        return null;
      },
      name: (value) => {
        if (value.trim().length === 0) return 'Nama tidak boleh kosong';
        return null;
      },
      status: (value) => {
        if (value.trim().length === 0) return 'Status tidak boleh kosong';
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: group, isLoading: isLoadingGroup } = RoleRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (group) {
        await RoleRepository.api.edit(`${group.id}`, {
          code: values.code,
          name: values.name,
          status: values.status,
          updated_by: jwtPayload?.userId || 0,
        });
      } else {
        await RoleRepository.api.create({
          code: values.code,
          name: values.name,
          status: values.status,
          created_by: jwtPayload?.userId || 0,
        });
      }

      notifications.show({
        title: 'Success',
        message: `Berhasil ${isEdit ? 'Edit' : 'Tambah'} Group`,
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

    if (group) {
      setFieldValue('code', `${group.code}`);
      setFieldValue('name', group.name);
      setFieldValue('status', group.status ? 'active' : 'inactive');
    }

    return () => {};
  }, [group, isReady, setFieldValue]);

  return (
    <>
      <LoadingOverlay visible={isLoadingGroup} />
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
                disabled={!!group}
                {...form.getInputProps('code')}
              />
              <TextInput placeholder="Masukan Nama" label="Nama" withAsterisk {...form.getInputProps('name')} />
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
