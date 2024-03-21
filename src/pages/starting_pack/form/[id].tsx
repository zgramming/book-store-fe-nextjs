import ContainerInputFileActionIcon from '@/components/ContainerInputFileActionIcon';
import AdminLayout from '@/components/layout/AdminLayout';
import { dummyModul } from '@/utils/dummy_data';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  Grid,
  TextInput,
  Select,
  FileInput,
  Textarea,
  Group,
  Button,
  NumberInput,
  Radio,
  Checkbox,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Data Badan Usaha">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {},
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });
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
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'xl'}>
          <Card withBorder>
            <Group justify="right">
              <Button onClick={back} variant="default">
                Kembali
              </Button>
              <Button type="submit">Simpan</Button>
            </Group>
            <Grid gutter={'xl'} grow>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                  lg: 6,
                  xl: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput
                    label="Nama Badan Usaha"
                    placeholder="Nama Badan Usaha"
                    {...form.getInputProps('nama_badan_usaha')}
                  />
                  <Select
                    label="Bidang Usaha"
                    placeholder="Pilih Bidang Usaha"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('bidang_usaha')}
                  />
                  <Select
                    label="Jenis Usaha"
                    placeholder="Pilih Jenis Usaha"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('jenis_usaha')}
                  />
                  <Select
                    label="Jenis Perusahaan"
                    placeholder="Pilih Jenis Perusahaan"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('jenis_perusahaan')}
                  />
                  <Select
                    label="Sumber Dana"
                    placeholder="Pilih Sumber Dana"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('sumber_dana')}
                  />
                  <Select
                    label="Tipe Usaha"
                    placeholder="Pilih Tipe Usaha"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('tipe_usaha')}
                  />
                  <Select
                    label="Tipe Identitas"
                    placeholder="Pilih Tipe Identitas"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('tipe_identitas')}
                  />
                  <TextInput label="NPWP" placeholder="NPWP" {...form.getInputProps('npwp')} />
                  <TextInput
                    label="Tempat Pendirian"
                    placeholder="Tempat Pendirian"
                    {...form.getInputProps('tempat_pendirian')}
                  />
                  <DateInput
                    rightSection={<IconCalendar />}
                    label="Tanggal Berdiri"
                    placeholder="Tanggal Berdiri"
                    valueFormat="YYYY-MM-DD"
                    {...form.getInputProps('tanggal_berdiri')}
                  />
                  <DateInput
                    rightSection={<IconCalendar />}
                    label="Tanggal Expired"
                    placeholder="Tanggal Expired"
                    valueFormat="YYYY-MM-DD"
                    {...form.getInputProps('tanggal_expired')}
                  />
                  <NumberInput label="Kadar" placeholder="Kadar" decimalScale={2} {...form.getInputProps('kadar')} />
                  <TextInput label="No. Akte" placeholder="No. Akte" {...form.getInputProps('no_akte')} />
                  <TextInput
                    label="No. Identitas / SIUP"
                    placeholder="No. Identitas / SIUP"
                    {...form.getInputProps('no_identitas_siup')}
                  />
                  <TextInput label="No. Telepon" placeholder="No. Telepon" {...form.getInputProps('no_telepon')} />
                  <TextInput label="No. HP" placeholder="No. HP" {...form.getInputProps('no_handphone')} />
                  <Select
                    label="Outlet"
                    placeholder="Pilih Outlet"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('outlet')}
                  />
                  <Checkbox.Group label="Stock Keeper" description="Pilih Recycle untuk di tempatkan di Stock Keeper">
                    <Group mt="xs">
                      <Checkbox value="pemenuhan_emas" label="Pemenuhan Emas" />
                      <Checkbox value="pemenuhan_batu" label="Pemenuhan Batu" />
                      <Checkbox value="pemenuhan_bahan_penolong" label="Pemenuhan Bahan Penolong" />
                    </Group>
                  </Checkbox.Group>
                  <Radio.Group label="Kewarganegaraan" {...form.getInputProps('kewarganegaraan')}>
                    <Group mt={'sm'}>
                      <Radio value="wni" label="WNI" />
                      <Radio value="wna" label="WNA" />
                    </Group>
                  </Radio.Group>
                  <ContainerInputFileActionIcon
                    input={
                      <FileInput
                        label="Gambar Design"
                        placeholder="Gambar Design"
                        rightSection={<IconUpload />}
                        {...form.getInputProps('gambar_design')}
                      />
                    }
                  />
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                  lg: 6,
                  xl: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <Textarea label="Alamat Usaha" placeholder="Alamat Usaha" {...form.getInputProps('alamat_usaha')} />
                  <TextInput
                    label="Kontak Person 1"
                    placeholder="Kontak Person 1"
                    {...form.getInputProps('kontak_person_1')}
                  />
                  <TextInput
                    label="Kontak Person 2"
                    placeholder="Kontak Person 2"
                    {...form.getInputProps('kontak_person_2')}
                  />
                  <TextInput label="No. HP 1" placeholder="No. HP 1" {...form.getInputProps('no_hp_1')} />
                  <TextInput label="No. HP 2" placeholder="No. HP 2" {...form.getInputProps('no_hp_2')} />
                  <Select
                    label="Provinsi"
                    placeholder="Pilih Provinsi"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('provinsi')}
                  />
                  <Select
                    label="Kabupaten"
                    placeholder="Pilih Kabupaten"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('kabupaten')}
                  />
                  <Select
                    label="Kecamatan"
                    placeholder="Pilih Kecamatan"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('kecamatan')}
                  />
                  <Select
                    label="Kelurahan"
                    placeholder="Pilih Kelurahan"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('kelurahan')}
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Card Section
            </Card.Section>
            <Grid gutter={'xl'} grow>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                  lg: 6,
                  xl: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <Select
                    label="Bank"
                    placeholder="Pilih Bank"
                    data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('bank')}
                  />
                  <TextInput label="Kode Bank" placeholder="Kode Bank" {...form.getInputProps('kode_bank')} />
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                  lg: 6,
                  xl: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput
                    label="Nomor Rekening"
                    placeholder="Nomor Rekening"
                    {...form.getInputProps('nomor_rekening')}
                  />
                  <TextInput label="Atas Nama" placeholder="Atas Nama" {...form.getInputProps('atas_nama')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
