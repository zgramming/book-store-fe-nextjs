import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Tenor Mikro">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      tenor: '',
    },
    validate: {
      tenor: (val) => {
        if (!val) return 'Tenor is required';
        return null;
      },
    },
  });

  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;
  const { data: tenorMikroDetail } = MasterKhusuRepository.hooks.tenorMikro.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      const repository = MasterKhusuRepository.api.tenorMikro;

      if (tenorMikroDetail) {
        await repository.update(`${tenorMikroDetail.id_inc}`, values);
      } else {
        await repository.create(values);
      }

      notifications.show({
        title: 'Success',
        message: tenorMikroDetail ? 'Tenor Mikro berhasil diubah' : 'Tenor Mikro berhasil ditambahkan',
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

    if (tenorMikroDetail) {
      setFieldValue('tenor', `${tenorMikroDetail.tenor}`);
    }

    return () => {};
  }, [isReady, setFieldValue, tenorMikroDetail]);

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
            <Grid gutter={'xl'} grow>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 12,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput label="Tenor" placeholder="Tenor" {...form.getInputProps('tenor')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
