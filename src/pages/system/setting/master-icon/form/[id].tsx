import ContainerInputFileActionIcon from '@/components/ContainerInputFileActionIcon';
import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { MasterIconRepository } from '@/features/master-icon/master-icon.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, FileInput, Group, Button, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const { back, query } = useRouter();
  const { id, action } = query;

  const { data: dataMasterIcon } = MasterIconRepository.hooks.useById(id as string | undefined);
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      status: 'active',
      icon: undefined as any,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Nama tidak boleh kosong'),
      code: (value) => (value.trim().length > 0 ? null : 'Kode tidak boleh kosong'),
      status: (value) => (value.trim().length > 0 ? null : 'Status tidak boleh kosong'),
    },
  });
  const { setFieldValue } = form;

  useEffect(() => {
    if (dataMasterIcon) {
      setFieldValue('name', dataMasterIcon.name);
      setFieldValue('code', dataMasterIcon.code);
      setFieldValue('status', dataMasterIcon.status);
    }
    return () => {};
  }, [dataMasterIcon, setFieldValue]);

  const onCreate = async (values: any) => {
    if (!values.icon) {
      notifications.show({
        title: 'Terjadi kesalahan',
        message: 'File tidak boleh kosong',
        color: 'red',
      });
      return;
    }

    await MasterIconRepository.api.create({
      name: values.name,
      code: values.code,
      status: values.status,
      icon: values.icon,
      created_by: jwtPayload?.userId || 0,
    });

    notifications.show({
      title: 'Berhasil',
      message: 'Data berhasil ditambahkan',
    });

    back();
  };

  const onUpdate = async (values: any) => {
    if (!dataMasterIcon) return;

    await MasterIconRepository.api.update(`${dataMasterIcon.id}`, {
      name: values.name,
      code: values.code,
      status: values.status,
      icon: values.icon,
      updated_by: jwtPayload?.userId || 0,
    });

    notifications.show({
      title: 'Berhasil',
      message: 'Data berhasil diperbarui',
    });

    back();
  };

  const onSubmit = async (values: any) => {
    try {
      const isEdit = action === 'edit' && dataMasterIcon;
      if (isEdit) {
        await onUpdate(values);
      } else {
        await onCreate(values);
      }
    } catch (error) {
      console.log({ error });

      const message = getErrorMessageAxios(error);

      notifications.show({
        title: 'Terjadi kesalahan',
        message,
        color: 'red',
      });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)} encType="multipart/form-data">
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
              <TextInput label="Kode" placeholder="Kode" {...form.getInputProps('code')} />
              <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('name')} />
              <ContainerInputFileActionIcon
                input={
                  <FileInput
                    label="File"
                    placeholder="File"
                    rightSection={<IconUpload />}
                    accept="image/png, image/jpeg, image/jpg"
                    {...form.getInputProps('icon')}
                  />
                }
                previewFile={dataMasterIcon?.icon_url}
              />
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

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Icon">{page}</AdminLayout>;
