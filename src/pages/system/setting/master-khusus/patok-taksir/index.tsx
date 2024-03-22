import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Master Khusus - Patok Taksir">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const {
    data: dataPatokTaksir,
    isLoading: isLoadingPatokTaksir,
    mutate: reloadDataPatokTaksir,
    total: totalPatokTaksir,
  } = MasterKhusuRepository.hooks.patokTaksir.useList({
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
      pathname: `patok-taksir/form/new`,
    });
  };

  const onEditButton = (id: string) => {
    push({
      pathname: `patok-taksir/form/${id}`,
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const repository = MasterKhusuRepository.api.patokTaksir;
      await repository.delete(id);
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Data dengan id ${id} berhasil dihapus`,
      });

      reloadDataPatokTaksir();
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
            <LoadingOverlay visible={isLoadingPatokTaksir} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>JENIS</Table.Th>
                    <Table.Th>PT 30 HARI</Table.Th>
                    <Table.Th>PT 60 HARI</Table.Th>
                    <Table.Th>PT 120 HARI</Table.Th>
                    <Table.Th>UP 30 HARI</Table.Th>
                    <Table.Th>UP 60 HARI</Table.Th>
                    <Table.Th>UP 120 HARI</Table.Th>
                    <Table.Th>KODE PASSION</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {dataPatokTaksir.map((item, index) => {
                    return (
                      <Table.Tr key={item.id_inc}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.jenis}</Table.Td>
                        <Table.Td>{item.pt_30hari}</Table.Td>
                        <Table.Td>{item.pt_60hari}</Table.Td>
                        <Table.Td>{item.pt_120hari}</Table.Td>
                        <Table.Td>{item.up_30hari}</Table.Td>
                        <Table.Td>{item.up_60hari}</Table.Td>
                        <Table.Td>{item.up_120hari}</Table.Td>
                        <Table.Td>{item.kode_passion}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button
                              variant="outline"
                              size="xs"
                              color="blue"
                              onClick={() => onEditButton(`${item.id_inc}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              color="red"
                              onClick={() => onDeleteButton(`${item.id_inc}`)}
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
              total={totalPatokTaksir}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
