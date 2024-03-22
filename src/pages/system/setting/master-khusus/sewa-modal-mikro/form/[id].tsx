import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Sewa Modal Mikro">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      sewa_modal: '',
    },
    validate: {
      sewa_modal: (val) => {
        if (!val) return 'Tenor is required';
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;
  const { data: dataSewaModalMikro, isLoading } = MasterKhusuRepository.hooks.sewaModalMikro.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      const repository = MasterKhusuRepository.api.sewaModalMikro;

      if (dataSewaModalMikro) {
        await repository.update(id as string, values);
      } else {
        await repository.create(values);
      }

      notifications.show({
        title: 'Success',
        message: `Sewa Modal Mikro ${dataSewaModalMikro ? 'updated' : 'created'}`,
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

    if (dataSewaModalMikro) {
      console.log({ dataSewaModalMikro });
      
      setFieldValue('sewa_modal', `${dataSewaModalMikro.sewa_modal}`);
    }

    return () => {};
  }, [dataSewaModalMikro, isReady, setFieldValue]);

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
                  <TextInput label="Sewa Modal" placeholder="Sewa Modal" {...form.getInputProps('sewa_modal')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
