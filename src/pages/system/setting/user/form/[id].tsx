import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { RoleRepository } from '@/features/role/role.repository';
import { UserRepository } from '@/features/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  TextInput,
  Select,
  Group,
  Button,
  Radio,
  PasswordInput,
  LoadingOverlay,
  Tabs,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect, useState } from 'react';

type FormTabType = 'user' | 'akses';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form User">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { data: userData, isLoading: isLoadingUser } = UserRepository.hooks.useById(id as string | undefined);

  const form = useForm({
    initialValues: {
      role_id: undefined as string | undefined,
      name: '',
      username: '',
      password: '',
      status: 'active' as string,
    },
    validate: {
      role_id: (value) => {
        if (!value) {
          return 'Role tidak boleh kosong';
        }

        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Nama tidak boleh kosong';
        }

        return null;
      },
      username: (value) => {
        if (!value) {
          return 'Username tidak boleh kosong';
        }

        return null;
      },

      password: (value) => {
        if (!value) {
          return 'Password tidak boleh kosong';
        }

        return null;
      },

      status: (value) => {
        if (!value) {
          return 'Status tidak boleh kosong';
        }

        return null;
      },
    },
  });

  const { setFieldValue } = form;

  const [activeTab, setActiveTab] = useState<FormTabType>('user');

  // Repository
  const { data: groupData } = RoleRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });

  const onSubmit = async (values: any) => {
    try {
      const body = {
        role_id: values.role_id,
        name: values.name,
        username: values.username,
        password: values.password,
        status: values.status,
        created_by: jwtPayload?.userId ?? 0,
      };

      if (userData) {
        await UserRepository.api.edit(`${userData.id}`, {
          ...body,
          updated_by: jwtPayload?.userId ?? 0,
        });
      } else {
        await UserRepository.api.create(body);
      }

      notifications.show({
        title: 'Success',
        message: `Berhasil ${userData ? 'mengubah' : 'menambahkan'} user`,
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

    if (userData) {
      if (userData.role_id) {
        setFieldValue('role_id', `${userData.role_id}`);
      }

      setFieldValue('username', userData.username);
      setFieldValue('name', userData.name);
      setFieldValue('status', `${userData.status}`);
      setFieldValue('password', userData.password);
    }

    return () => {};
  }, [isReady, setFieldValue, userData]);

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
              Form User
            </Card.Section>
            <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab as FormTabType)}>
              <Tabs.List>
                <Tabs.Tab value="user" leftSection={<IconUser size="0.8rem" />}>
                  DATA USER
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="user" pt="xs">
                <Stack gap={'md'}>
                  <Select
                    searchable
                    clearable
                    label="Role"
                    placeholder="Pilih Role"
                    data={groupData.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    {...form.getInputProps('role_id')}
                  />
                  <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
                  <TextInput
                    placeholder="Your username"
                    label="Username"
                    withAsterisk
                    {...form.getInputProps('username')}
                  />
                  <PasswordInput
                    placeholder="Your password"
                    label="Password"
                    withAsterisk
                    {...form.getInputProps('password')}
                  />
                  <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                    <Group>
                      <Radio value="active" label="Aktif" />
                      <Radio value="inactive" label="Tidak Aktif" />
                    </Group>
                  </Radio.Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Stack>
      </form>
    </>
  );
}
