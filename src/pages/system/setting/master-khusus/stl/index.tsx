import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Master Khusus - STL">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);

  const {
    data: dataSTL,
    isLoading: isLoadingSTL,
    total: totalSTL,
    mutate: reloadDataSTL,
  } = MasterKhusuRepository.hooks.stl.useList({
    page: activePagination,
    pageSize: parseInt(sizePagination),
  });

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
      pathname: `stl/form/new`,
    });
  };

  const onEditButton = (id: string) => {
    push({
      pathname: `stl/form/${id}`,
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const repository = MasterKhusuRepository.api.stl;
      await repository.delete(id);
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Data dengan id ${id} berhasil dihapus`,
      });

      reloadDataSTL();
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
            <LoadingOverlay visible={isLoadingSTL} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>HARGA BERLIAN 1</Table.Th>
                    <Table.Th>HARGA BERLIAN 2</Table.Th>
                    <Table.Th>HARGA EMAS</Table.Th>
                    <Table.Th>HARGA LANTAKAN EMAS</Table.Th>
                    <Table.Th>HARGA MUTIARA</Table.Th>
                    <Table.Th>HARGA PERAK</Table.Th>
                    <Table.Th>TANGGAL BERLAKU</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {dataSTL.map((item, index) => {
                    return (
                      <Table.Tr key={item.id_stl}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.hargaBerlian}</Table.Td>
                        <Table.Td>{item.hargaBerlian2}</Table.Td>
                        <Table.Td>{item.hargaEmas}</Table.Td>
                        <Table.Td>{item.hargaLantakanEmas}</Table.Td>
                        <Table.Td>{item.hargaMutiara}</Table.Td>
                        <Table.Td>{item.hargaPerak}</Table.Td>
                        <Table.Td>{readableDate(item.tglBerlaku)}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button
                              variant="outline"
                              size="xs"
                              color="blue"
                              onClick={() => onEditButton(`${item.id_stl}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              color="red"
                              onClick={() => onDeleteButton(`${item.id_stl}`)}
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
              total={totalSTL}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
