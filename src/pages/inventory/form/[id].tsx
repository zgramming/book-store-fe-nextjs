import AdminLayout from '@/components/layout/AdminLayout';
import { InventoryRepository } from '@/features/inventory/inventory.repository';
import { MasterBookRepository } from '@/features/master-book/master-book.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, NumberInput, LoadingOverlay, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Inventory">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      book_id: undefined as string | undefined,
      location: '',
      stock: 0,
    },
    validate: {
      location: (value) => (value.length > 0 ? null : 'Location is required'),
      stock: (value) => (value > 0 ? null : 'Stock is required'),
      book_id: (value) => (value ? null : 'Book is required'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;

  const { data: inventoryData, isLoading } = InventoryRepository.hooks.useById(id as string | undefined);
  const { data: masterBookList } = MasterBookRepository.hooks.useList({
    limit: 100,
    page: 1,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      if (inventoryData) {
        // Update
        await InventoryRepository.api.update(id as string, values);
      } else {
        // Create
        await InventoryRepository.api.create(values);
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

    if (inventoryData) {
      if (inventoryData.book_id) {
        setFieldValue('book_id', `${inventoryData.book_id}`);
      }
      setFieldValue('location', inventoryData.location);
      setFieldValue('stock', inventoryData.stock);
    }

    return () => {};
  }, [isReady, inventoryData, setFieldValue]);

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
                  <Select
                    label="Book"
                    placeholder="Choose book"
                    data={masterBookList.map((item) => ({ value: `${item.id}`, label: item.title }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('book_id')}
                  />
                  <TextInput label="Location" placeholder="Location" {...form.getInputProps('location')} />
                  <NumberInput
                    disabled={!!inventoryData}
                    label="Stock"
                    placeholder="Stock"
                    {...form.getInputProps('stock')}
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
