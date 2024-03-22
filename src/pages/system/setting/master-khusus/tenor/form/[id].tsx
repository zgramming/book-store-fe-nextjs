import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { MasterDataRepository } from '@/features/setting/master_data/master-data.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Select, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Tenor">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      jenis_tenor: undefined as string | undefined,
      tenor: '',
      adm: '',
      sm: '',
      sm_maks: '',
      denda: '',
      rasio_taksir_min: '',
      rasio_taksir: '',
      ltv: '',
    },
    validate: {
      jenis_tenor: (val) => {
        if (!val) return 'Jenis is required';
        return null;
      },

      tenor: (val) => {
        if (!val) return 'Tenor is required';
        return null;
      },

      adm: (val) => {
        if (!val) return 'Adm is required';
        return null;
      },

      sm: (val) => {
        if (!val) return 'Sm is required';
        return null;
      },

      sm_maks: (val) => {
        if (!val) return 'Sm Maks is required';
        return null;
      },

      denda: (val) => {
        if (!val) return 'Denda is required';
        return null;
      },

      rasio_taksir_min: (val) => {
        if (!val) return 'Rasio Taksir Min is required';
        return null;
      },

      rasio_taksir: (val) => {
        if (!val) return 'Rasio Taksir is required';
        return null;
      },

      ltv: (val) => {
        if (!val) return 'Ltv is required';
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;
  const { data: tenorDetail, isLoading } = MasterKhusuRepository.hooks.tenor.useById(id as string | undefined);

  // Repository
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

      const repository = MasterKhusuRepository.api.tenor;

      if (tenorDetail) {
        await repository.update(id as string, values);
      } else {
        await repository.create(values);
      }

      notifications.show({
        title: 'Success',
        message: tenorDetail ? 'Tenor berhasil diubah' : 'Tenor berhasil ditambahkan',
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

    if (tenorDetail) {
      setFieldValue('jenis_tenor', `${tenorDetail.jenis_tenor}`);
      setFieldValue('tenor', `${tenorDetail.tenor}`);
      setFieldValue('adm', `${tenorDetail.adm}`);
      setFieldValue('sm', `${tenorDetail.sm}`);
      setFieldValue('sm_maks', `${tenorDetail.sm_maks}`);
      setFieldValue('denda', `${tenorDetail.denda}`);
      setFieldValue('rasio_taksir_min', `${tenorDetail.rasio_taksir_min}`);
      setFieldValue('rasio_taksir', `${tenorDetail.rasio_taksir}`);
      setFieldValue('ltv', `${tenorDetail.ltv}`);
    }

    return () => {};
  }, [isReady, setFieldValue, tenorDetail]);

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
                    {...form.getInputProps('jenis_tenor')}
                  />
                  <TextInput label="Tenor" placeholder="Tenor" {...form.getInputProps('tenor')} />
                  <TextInput label="Adm" placeholder="Adm" {...form.getInputProps('adm')} />
                  <TextInput label="Sm" placeholder="Sm" {...form.getInputProps('sm')} />
                  <TextInput label="SM Maks" placeholder="SM Maks" {...form.getInputProps('sm_maks')} />
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput label="Denda" placeholder="Denda" {...form.getInputProps('denda')} />
                  <TextInput
                    label="Rasio Taksir Min"
                    placeholder="Rasio Taksir Min"
                    {...form.getInputProps('rasio_taksir_min')}
                  />
                  <TextInput label="Rasio Taksir" placeholder="Rasio Taksir" {...form.getInputProps('rasio_taksir')} />
                  <TextInput label="Ltv" placeholder="Ltv" {...form.getInputProps('ltv')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
