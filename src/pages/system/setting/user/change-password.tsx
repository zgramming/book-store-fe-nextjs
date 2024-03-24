import AdminLayout from '@/components/layout/AdminLayout';
import { UserRepository } from '@/features/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Group, Button, PasswordInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Change Password">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) => {
        if (!value) {
          return 'Password tidak boleh kosong';
        }

        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: userData, isLoading: isLoadingUser } = UserRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (!userData) {
        throw new Error(`Tidak dapat menemukan data user dengan id ${id}`);
      }

      const { password } = values;
      await UserRepository.api.changePassword(userData.id, password);

      notifications.show({
        title: 'Berhasil',
        message: 'Password berhasil diubah',
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

    return () => {};
  }, [isReady]);

  return (
    <>
      <LoadingOverlay visible={isLoadingUser} />
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
              <PasswordInput
                placeholder="New Password"
                label="Password"
                withAsterisk
                {...form.getInputProps('password')}
              />
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
