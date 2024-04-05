import AdminLayout from '@/components/layout/AdminLayout';
import { MasterStudentRepository } from '@/features/master-student/master-student.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, LoadingOverlay, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Student">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      name: '',
      nim: '',
      status: 'active',
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      nim: (value) => (value.length > 0 ? null : 'Nim is required'),
      status: (value) => (value.length > 0 ? null : 'Status is required'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;

  const { data: masterBookData, isLoading } = MasterStudentRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      if (masterBookData) {
        // Update
        await MasterStudentRepository.api.update(id as string, values);
      } else {
        // Create
        await MasterStudentRepository.api.create(values);
      }

      notifications.show({
        title: 'Success',
        message: 'Data berhasil disimpan',
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

    if (masterBookData) {
      setFieldValue('name', masterBookData.name);
      setFieldValue('nim', masterBookData.nim);
      setFieldValue('status', masterBookData.status);
    }

    return () => {};
  }, [isReady, masterBookData, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'xl'}>
          <LoadingOverlay visible={isLoading} />
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
              Form Master Book
            </Card.Section>
            <Grid gutter={'xl'} grow>
              <Grid.Col span={12}>
                <Stack gap={'sm'}>
                  <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
                  <TextInput label="Nim" placeholder="Nim" {...form.getInputProps('nim')} />
                  <Radio.Group label="Status" {...form.getInputProps('status')}>
                    <Group mt={'sm'}>
                      <Radio value="active" label="Active" />
                      <Radio value="inactive" label="InActive" />
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
