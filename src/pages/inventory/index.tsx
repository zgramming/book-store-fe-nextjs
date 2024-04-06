import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { InventoryRepository } from '@/features/inventory/inventory.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import {
  Button,
  Card,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Radio,
  Stack,
  Table,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconBuildingWarehouse, IconEditCircle, IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface ModalIncreaseAndDecreaseStockProps {
  id: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
const ModalIncreaseAndDecreaseStock = ({ id, open, onClose, onSuccess }: ModalIncreaseAndDecreaseStockProps) => {
  const form = useForm({
    initialValues: {
      stock: 0,
      action: 'increase' as 'increase' | 'decrease',
    },
    validate: {
      stock: (value) => {
        // Min value is 1
        if (value <= 0) {
          return 'Stock harus lebih dari 0';
        }

        return null;
      },
    },
  });

  const { data: inventoryData, isLoading } = InventoryRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        values,
      });

      if (!inventoryData) {
        return;
      }

      if (values.action == 'decrease') {
        await InventoryRepository.api.decreaseStock(id as string, values.stock);
      } else {
        await InventoryRepository.api.increaseStock(id as string, values.stock);
      }

      notifications.show({
        title: 'Success',
        message: 'Stock berhasil diupdate',
        color: 'green',
      });

      onSuccess();
      onClose();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  return (
    <Modal title="Increase and Decrease Stock" opened={open} onClose={onClose}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <LoadingOverlay visible={isLoading} />
          <TextInput
            label="Stock"
            placeholder="Stock"
            required
            {...form.getInputProps('stock')}
            type="number"
            min={1}
          />
          <Radio.Group label="Action" {...form.getInputProps('action')}>
            <Group mt={'sm'}>
              <Radio value="increase" label="Increase" />
              <Radio value="decrease" label="Decrease" />
            </Group>
          </Radio.Group>
          <Button type="submit" color="blue">
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Inventory">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [
    isModalIncreaseDecreaseStockOpen,
    { open: openModalIncreaseDecreaseStock, close: closeModalIncreaseDecreaseStock },
  ] = useDisclosure(false);

  const {
    data: inventoryData,
    isLoading,
    mutate: reloadData,
    total,
  } = InventoryRepository.hooks.useList({
    page: activePagination,
    limit: parseInt(sizePagination),
    title: searchQuery,
  });

  const onOpenModal = (id: string) => {
    setSelectedId(id);
    openModalIncreaseDecreaseStock();
  };

  const onCloseModal = () => {
    setSelectedId(undefined);
    closeModalIncreaseDecreaseStock();
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.length === 0 || value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  const onAddButton = () => {
    push({
      pathname: 'inventory/form/new',
    });
  };

  const onEditButton = (id: string) => {
    push({
      pathname: `inventory/form/${id}`,
    });
  };

  return (
    <>
      <Card withBorder>
        <Stack gap={'md'}>
          <Grid gutter={'lg'}>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Group justify="left">
                <TextInput
                  placeholder="Cari sesuatu..."
                  rightSection={<IconSearch />}
                  defaultValue={searchQuery}
                  onChange={onChangeSearch}
                />
              </Group>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Flex direction={'row'} justify={'end'} gap={'md'}>
                <Button leftSection={<IconPlus />} variant="filled" onClick={onAddButton}>
                  Tambah
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
          <Stack gap={'md'} id="table">
            <LoadingOverlay visible={isLoading} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>AUTHOR</Table.Th>
                    <Table.Th>BOOK</Table.Th>
                    <Table.Th>LOCATION</Table.Th>
                    <Table.Th>INITIAL STOCK</Table.Th>
                    <Table.Th>CURRENT STOCK</Table.Th>
                    <Table.Th>CREATED AT</Table.Th>
                    <Table.Th>UPDATED AT</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {inventoryData.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.book.author}</Table.Td>
                        <Table.Td>{item.book.title}</Table.Td>
                        <Table.Td>{item.location}</Table.Td>
                        <Table.Td>{item.stock}</Table.Td>
                        <Table.Td>{item.current_stock}</Table.Td>
                        <Table.Td>{readableDate(item.created_at)}</Table.Td>
                        <Table.Td>{readableDate(item.updated_at)}</Table.Td>
                        <Table.Td>
                          <Group gap={'md'}>
                            <Tooltip label="Edit" position="left">
                              <Button
                                variant="outline"
                                size="xs"
                                color="blue"
                                onClick={() => onEditButton(`${item.id}`)}
                              >
                                <IconEditCircle size={16} />
                              </Button>
                            </Tooltip>
                            <Tooltip label="Increase/Decrease Stock" position="right">
                              <Button
                                variant="outline"
                                size="xs"
                                color="green"
                                onClick={() => onOpenModal(`${item.id}`)}
                              >
                                <IconBuildingWarehouse size={16} />
                              </Button>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              activePagination={activePagination}
              paginationSize={sizePagination}
              total={total}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>

      {isModalIncreaseDecreaseStockOpen && (
        <ModalIncreaseAndDecreaseStock
          onClose={onCloseModal}
          id={selectedId as string}
          onSuccess={reloadData}
          open={isModalIncreaseDecreaseStockOpen}
        />
      )}
    </>
  );
}
