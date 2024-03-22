import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, Group, Button, NumberInput, Textarea, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Pertanyaan Mikro">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      pertanyaan: '',
      urutan: '1',
    },
    validate: {
      pertanyaan: (value) => (value ? null : 'Pertanyaan harus diisi'),
      urutan: (value) => (value ? null : 'Urutan harus diisi'),
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue } = form;

  const { data: dataPertanyaanMikro, isLoading } = MasterKhusuRepository.hooks.pertanyaanMikro.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      const repository = MasterKhusuRepository.api.pertanyaanMikro;

      if (dataPertanyaanMikro) {
        await repository.update(id as string, values);
      } else {
        await repository.create(values);
      }

      notifications.show({
        title: 'Success',
        message: `Berhasil ${dataPertanyaanMikro ? 'update' : 'create'} data`,
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

    if (dataPertanyaanMikro) {
      setFieldValue('pertanyaan', dataPertanyaanMikro.pertanyaan);
      setFieldValue('urutan', `${dataPertanyaanMikro.urutan}`);
    }

    return () => {};
  }, [dataPertanyaanMikro, isReady, setFieldValue]);

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
                  <Textarea label="Pertanyaan" placeholder="Pertanyaan" {...form.getInputProps('pertanyaan')} />
                  <NumberInput label="Urutan" placeholder="Urutan" {...form.getInputProps('urutan')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
