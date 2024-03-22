import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, Group, Button, NumberInput, LoadingOverlay } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - STL">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      hargaBerlian: '',
      hargaBerlian2: '',
      hargaEmas: '',
      hargaLantakanEmas: '',
      hargaMutiara: '',
      hargaPerak: '',
      tglBerlaku: new Date() as Date,
    },
    validate: {
      hargaBerlian: (value) => (value ? null : 'Harga Berlian 1 tidak boleh kosong'),
      hargaBerlian2: (value) => (value ? null : 'Harga Berlian 2 tidak boleh kosong'),
      hargaEmas: (value) => (value ? null : 'Harga Emas tidak boleh kosong'),
      hargaLantakanEmas: (value) => (value ? null : 'Harga Lantakan Emas tidak boleh kosong'),
      hargaMutiara: (value) => (value ? null : 'Harga Mutiara tidak boleh kosong'),
      hargaPerak: (value) => (value ? null : 'Harga Perak tidak boleh kosong'),
      tglBerlaku: (value) => (value ? null : 'Tanggal Berlaku tidak boleh kosong'),
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue } = form;

  const { data: dataSTL, isLoading } = MasterKhusuRepository.hooks.stl.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });
      const repository = MasterKhusuRepository.api.stl;
      const tglBerlaku = dayjs(values.tglBerlaku).format('YYYY-MM-DD');

      if (dataSTL) {
        await repository.update(id as string, {
          ...values,
          tglBerlaku,
        });
      } else {
        await repository.create({
          ...values,
          tglBerlaku,
        });
      }

      notifications.show({
        title: 'Berhasil',
        message: `Data STL berhasil ${dataSTL ? 'diupdate' : 'ditambahkan'}`,
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

    if (dataSTL) {
      setFieldValue('hargaBerlian', `${dataSTL.hargaBerlian}`);
      setFieldValue('hargaBerlian2', `${dataSTL.hargaBerlian2}`);
      setFieldValue('hargaEmas', `${dataSTL.hargaEmas}`);
      setFieldValue('hargaLantakanEmas', `${dataSTL.hargaLantakanEmas}`);
      setFieldValue('hargaMutiara', `${dataSTL.hargaMutiara}`);
      setFieldValue('hargaPerak', `${dataSTL.hargaPerak}`);
      setFieldValue('tglBerlaku', dayjs(dataSTL.tglBerlaku).toDate());
    }

    return () => {};
  }, [dataSTL, isReady, setFieldValue]);

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
                  <NumberInput
                    label="Harga Berlian 1"
                    placeholder="Harga Berlian 1"
                    decimalScale={2}
                    {...form.getInputProps('hargaBerlian')}
                  />
                  <NumberInput
                    label="Harga Berlian 2"
                    placeholder="Harga Berlian 2"
                    decimalScale={2}
                    {...form.getInputProps('hargaBerlian2')}
                  />
                  <NumberInput
                    label="Harga Emas"
                    placeholder="Harga Emas"
                    decimalScale={2}
                    {...form.getInputProps('hargaEmas')}
                  />
                  <NumberInput
                    label="Harga Lantakan Emas"
                    placeholder="Harga Lantakan Emas"
                    decimalScale={2}
                    {...form.getInputProps('hargaLantakanEmas')}
                  />
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                }}
              >
                <Stack gap={'sm'}>
                  <NumberInput
                    label="Harga Mutiara"
                    placeholder="Harga Mutiara"
                    decimalScale={2}
                    {...form.getInputProps('hargaMutiara')}
                  />
                  <NumberInput
                    label="Harga Perak"
                    placeholder="Harga Perak"
                    decimalScale={2}
                    {...form.getInputProps('hargaPerak')}
                  />
                  <DateInput
                    rightSection={<IconCalendar />}
                    label="Tanggal Berlaku"
                    placeholder="Tanggal Berlaku"
                    valueFormat="YYYY-MM-DD"
                    {...form.getInputProps('tglBerlaku')}
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
