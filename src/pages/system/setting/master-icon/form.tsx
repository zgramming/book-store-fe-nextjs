import ContainerInputFileActionIcon from '@/components/ContainerInputFileActionIcon';
import AdminLayout from '@/components/layout/AdminLayout';
import { IMasterIconCreateOrUpdateForm } from '@/features/setting/master_icon/dto/master_icon_create_update.dto';
import { FileRepository } from '@/features/common/file/file.repository';
import { MasterIconRepository } from '@/features/setting/master_icon/master_icon.repository';
import { baseFileURL } from '@/utils/constant';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, FileInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

export default function Page() {
  const { back, query } = useRouter();
  const { id, action } = query;

  const { data: dataMasterIcon } = MasterIconRepository.hooks.useDetailMasterIcon(id as string | undefined);
  const [previewImage, setPreviewImage] = useState<File | string | null>(null);
  const form = useForm({
    initialValues: {
      kode: '',
      nama: '',
      file: null as any,
    },
    validate: {
      kode: (value) => (value ? undefined : 'Kode tidak boleh kosong'),
      nama: (value) => (value ? undefined : 'Nama tidak boleh kosong'),
    },
  });
  const { setFieldValue } = form;

  useEffect(() => {
    if (dataMasterIcon) {
      setFieldValue('kode', dataMasterIcon.kode_icon);
      setFieldValue('nama', dataMasterIcon.nama_icon);
      setPreviewImage(`${baseFileURL}/${dataMasterIcon.url_icon}`);
    }
    return () => {};
  }, [dataMasterIcon, setFieldValue]);

  const onUpload = async (file: File | null) => {
    setPreviewImage(file);
    setFieldValue('file', file);
  };

  const onCreate = async (values: any) => {
    const { kode, nama, file } = values;

    if (!file) {
      notifications.show({
        title: 'Terjadi kesalahan',
        message: 'File tidak boleh kosong',
        color: 'red',
      });
      return;
    }

    const formDataFile = new FormData();
    formDataFile.append('file', file);
    const upload = await FileRepository.api.upload(formDataFile);
    const nameFile = upload.filename;

    const body: IMasterIconCreateOrUpdateForm = {
      nama_icon: nama,
      kode_icon: kode,
      url_icon: nameFile,
    };

    await MasterIconRepository.api.create(body);

    notifications.show({
      title: 'Berhasil',
      message: 'Data berhasil ditambahkan',
    });

    back();
  };

  const onUpdate = async (values: any) => {
    const { kode, nama, file } = values;

    const body: IMasterIconCreateOrUpdateForm = {
      nama_icon: nama,
      kode_icon: kode,
    };

    if (file) {
      const formDataFile = new FormData();

      formDataFile.append('file', file);
      const upload = await FileRepository.api.upload(formDataFile);
      const nameFile = upload.filename;
      body.url_icon = nameFile;
    }
    await MasterIconRepository.api.update(Number(id), body);

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
              <TextInput label="Kode" placeholder="Kode" {...form.getInputProps('kode')} />
              <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('nama')} />
              <ContainerInputFileActionIcon
                input={
                  <FileInput
                    label="File"
                    placeholder="File"
                    rightSection={<IconUpload />}
                    accept="image/png, image/jpeg, image/jpg"
                    {...form.getInputProps('file')}
                    onChange={onUpload}
                  />
                }
                previewFile={previewImage}
              />
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Icon">{page}</AdminLayout>;
