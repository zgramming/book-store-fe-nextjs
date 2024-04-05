import AdminLayout from '@/components/layout/AdminLayout';
import { MasterBookRepository } from '@/features/master-book/master-book.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, NumberInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Book">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      title: '',
      author: '',
      publisher: '',
      year: new Date().getFullYear(),
    },
    validate: {
      title: (value) => (value.length > 0 ? null : 'Title is required'),
      author: (value) => (value.length > 0 ? null : 'Author is required'),
      publisher: (value) => (value.length > 0 ? null : 'Publisher is required'),
      year: (value) => (value > 0 ? null : 'Year is required'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;

  const { data: masterBookData, isLoading } = MasterBookRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      if (masterBookData) {
        // Update
        await MasterBookRepository.api.update(id as string, values);
      } else {
        // Create
        await MasterBookRepository.api.create(values);
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
      setFieldValue('title', masterBookData.title);
      setFieldValue('author', masterBookData.author);
      setFieldValue('publisher', masterBookData.publisher);
      setFieldValue('year', masterBookData.year);
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
                  <TextInput label="Title" placeholder="Title" {...form.getInputProps('title')} />
                  <TextInput label="Publisher" placeholder="Publisher" {...form.getInputProps('publisher')} />
                  <TextInput label="Author" placeholder="Author" {...form.getInputProps('author')} />
                  <NumberInput label="Year" placeholder="Year" {...form.getInputProps('year')} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
