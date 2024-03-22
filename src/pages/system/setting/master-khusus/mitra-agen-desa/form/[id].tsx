import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, Textarea, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Mitra Agen Desa">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      name: '',
      contact: '',
      email: '',
      description: '',
      status: 't' as string,
    },
    validate: {
      name: (value) => (value ? undefined : 'Nama tidak boleh kosong'),
      contact: (value) => (value ? undefined : 'Kontak tidak boleh kosong'),
      email: (value) => (value ? undefined : 'Email tidak boleh kosong'),
      description: (value) => (value ? undefined : 'Keterangan tidak boleh kosong'),
      status: (value) => (value ? undefined : 'Status tidak boleh kosong'),
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue } = form;

  const { data: dataMitraAgenDesa, isLoading } = MasterKhusuRepository.hooks.mitraAgenDesa.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
      });

      const repository = MasterKhusuRepository.api.mitraAgenDesa;

      if (dataMitraAgenDesa) {
        await repository.update(id as string, values);
      } else {
        await repository.create(values);
      }

      notifications.show({
        title: 'Success',
        message: `Data ${dataMitraAgenDesa ? 'diupdate' : 'ditambahkan'}`,
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

    if (dataMitraAgenDesa) {
      setFieldValue('name', dataMitraAgenDesa.name);
      setFieldValue('contact', dataMitraAgenDesa.contact);
      setFieldValue('email', dataMitraAgenDesa.email);
      setFieldValue('description', dataMitraAgenDesa.description);
      setFieldValue('status', dataMitraAgenDesa.status);
    }
    return () => {};
  }, [dataMitraAgenDesa, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
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
            <Grid gutter={'xl'} grow>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 12,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('name')} />
                  <TextInput label="Kontak" placeholder="Kontak" {...form.getInputProps('contact')} />
                  <TextInput label="Email" placeholder="Email" {...form.getInputProps('email')} />
                  <Textarea label="Keterangan" placeholder="Keterangan" {...form.getInputProps('description')} />
                  <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                    <Group pt={'sm'}>
                      <Radio value="t" label="Aktif" />
                      <Radio value="f" label="Tidak Aktif" />
                    </Group>
                  </Radio.Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
