import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { dummyModul } from '@/utils/dummy_data';
import { getErrorMessageAxios } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, Modal, ScrollArea, Select, Stack, Table, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconFilter, IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Data Badan Usaha">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [isModalFilterOpen, { open: openModalFilter, close: closeModalFilter }] = useDisclosure(false);

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
      pathname: 'data_badan_usaha/form',
    });
  };

  const onEditButton = (id: string) => {
    push({
      pathname: `data_badan_usaha/form/${id}`,
    });
  };

  const onDeleteHandler = (id: string) => {
    try {
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Data dengan id ${id} berhasil dihapus`,
      });
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message: message,
        color: 'red',
      });
    }
  };

  const onDeleteButton = (id: string) => {
    modals.openConfirmModal({
      title: 'Konfirmasi',
      children: 'Apakah anda yakin ingin menghapus data ini?',
      labels: {
        cancel: 'Batal',
        confirm: 'Hapus',
      },
      confirmProps: {
        color: 'red',
      },
      onConfirm: () => onDeleteHandler(id),
      onCancel: () => {
        alert('Cancel');
      },
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
                <Button leftSection={<IconFilter size="1rem" />} variant="outline" onClick={openModalFilter}>
                  Filter
                </Button>
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
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>ID STOK</Table.Th>
                    <Table.Th>INVOICE</Table.Th>
                    <Table.Th>TANGGAL</Table.Th>
                    <Table.Th>VENDOR</Table.Th>
                    <Table.Th>JENIS BAHAN</Table.Th>
                    <Table.Th>KADAR</Table.Th>
                    <Table.Th>BERAT</Table.Th>
                    <Table.Th>HARGA BELI/GRAM</Table.Th>
                    <Table.Th>TOTAL HARGA</Table.Th>
                    <Table.Th>PPH 22</Table.Th>
                    <Table.Th>JUMLAH BAYAR</Table.Th>
                    <Table.Th>METODE BAYAR</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {dummyModul.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>{item.id}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button variant="outline" size="xs" color="blue" onClick={() => onEditButton(`${item.id}`)}>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              color="red"
                              onClick={() => onDeleteButton(`${item.id}`)}
                            >
                              Hapus
                            </Button>
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
              total={100}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
      {/* Modal Filter */}
      <Modal
        opened={isModalFilterOpen}
        onClose={closeModalFilter}
        title="Filter"
        size={'md'}
        scrollAreaComponent={ScrollArea.Autosize}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Stack gap={'sm'}>
          <Select
            label="Jenis Perhiasan"
            placeholder="Pilih Jenis Perhiasan"
            data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
            nothingFoundMessage="No options"
            searchable
            clearable
          />
          <Select
            label="Pembayaran"
            placeholder="Pilih Pembayaran"
            data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
            nothingFoundMessage="No options"
            searchable
            clearable
          />
          <Group gap={'md'} grow>
            <DatePickerInput
              dropdownType="modal"
              rightSection={<IconCalendar />}
              label="Mulai"
              placeholder="Mulai"
              valueFormat="YYYY-MM-DD"
            />
            <DatePickerInput
              dropdownType="modal"
              rightSection={<IconCalendar />}
              label="Selesai"
              placeholder="Selesai"
              valueFormat="YYYY-MM-DD"
            />
          </Group>
          <Group justify="right">
            <Button onClick={closeModalFilter} variant="default">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
