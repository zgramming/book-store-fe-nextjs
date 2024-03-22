import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { MasterDataRepository } from '@/features/setting/master_data/master-data.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Select, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Patok Taksir">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      jenis: undefined as string | undefined,
      pt_30hari: '',
      pt_60hari: '',
      pt_120hari: '',
      up_30hari: '',
      up_60hari: '',
      up_120hari: '',
      kode_passion: '',
    },
    validate: {
      jenis: (value) => (value ? null : 'Jenis harus diisi'),
      pt_30hari: (value) => (value ? null : 'PT 30 hari harus diisi'),
      pt_60hari: (value) => (value ? null : 'PT 60 hari harus diisi'),
      pt_120hari: (value) => (value ? null : 'PT 120 hari harus diisi'),
      up_30hari: (value) => (value ? null : 'UP 30 hari harus diisi'),
      up_60hari: (value) => (value ? null : 'UP 60 hari harus diisi'),
      up_120hari: (value) => (value ? null : 'UP 120 hari harus diisi'),
      kode_passion: (value) => (value ? null : 'Kode Passion harus diisi'),
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue } = form;

  const { data: dataPatokTaksir, isLoading } = MasterKhusuRepository.hooks.patokTaksir.useById(
    id as string | undefined,
  );

  const { masterData: dataJenis } = MasterDataRepository.hooks.useListMasterDataByCodeCategory({
    page: 1,
    pageSize: 1000,
    codeCategory: 'jen_gad',
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      const repository = MasterKhusuRepository.api.patokTaksir;

      if (dataPatokTaksir) {
        await repository.update(id as string, values);
      } else {
        await repository.create(values);
      }

      notifications.show({
        title: 'Success',
        message: dataPatokTaksir ? 'Patok Taksir berhasil diubah' : 'Patok Taksir berhasil ditambahkan',
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

    if (dataPatokTaksir) {
      setFieldValue('jenis', `${dataPatokTaksir.jenis}`);
      setFieldValue('pt_30hari', `${dataPatokTaksir.pt_30hari}`);
      setFieldValue('pt_60hari', `${dataPatokTaksir.pt_60hari}`);
      setFieldValue('pt_120hari', `${dataPatokTaksir.pt_120hari}`);
      setFieldValue('up_30hari', `${dataPatokTaksir.up_30hari}`);
      setFieldValue('up_60hari', `${dataPatokTaksir.up_60hari}`);
      setFieldValue('up_120hari', `${dataPatokTaksir.up_120hari}`);
      setFieldValue('kode_passion', `${dataPatokTaksir.kode_passion}`);
    }

    return () => {};
  }, [dataPatokTaksir, isReady, setFieldValue]);

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
                  md: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <Select
                    label="Jenis"
                    placeholder="Pilih Jenis"
                    data={dataJenis.map((item) => ({ value: `${item.kodeMaster}`, label: item.namaData }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('jenis')}
                  />
                  <TextInput label="PT 30 Hari" placeholder="PT 30 Hari" {...form.getInputProps('pt_30hari')} />
                  <TextInput label="PT 60 Hari" placeholder="PT 60 Hari" {...form.getInputProps('pt_60hari')} />
                  <TextInput label="PT 120 Hari" placeholder="PT 120 Hari" {...form.getInputProps('pt_120hari')} />
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput label="UP 30 Hari" placeholder="UP 30 Hari" {...form.getInputProps('up_30hari')} />
                  <TextInput label="UP 60 Hari" placeholder="UP 60 Hari" {...form.getInputProps('up_60hari')} />
                  <TextInput label="UP 120 Hari" placeholder="UP 120 Hari" {...form.getInputProps('up_120hari')} />
                  <TextInput label="Kode Passion" placeholder="Kode Passion" {...form.getInputProps('kode_passion')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
