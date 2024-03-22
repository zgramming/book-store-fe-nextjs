import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { MasterIconRepository } from '@/features/setting/master_icon/master_icon.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Master Icon">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);

  const { items: dataMasterIcon, mutate } = MasterIconRepository.hooks.useListMasterIcon({
    page: activePagination,
    pageSize: Number(sizePagination),
    namaIcon: searchQuery,
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
      pathname: 'master-icon/form',
      query: { action: 'add' },
    });
  };

  const onEditButton = (id: number) => {
    push({
      pathname: 'master-icon/form',
      query: { id: id, action: 'edit' },
    });
  };

  const onDeleteHandler = async (id: number) => {
    try {
      await MasterIconRepository.api.delete(id);
      notifications.show({
        title: 'Berhasil',
        message: 'Data berhasil dihapus',
      });
      mutate();
    } catch (error) {
      const message = getErrorMessageAxios(error);

      notifications.show({
        title: 'Terjadi kesalahan',
        message,
        color: 'red',
      });
    }
  };

  const onDeleteButton = (id: number) => {
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
      onCancel: () => {},
    });
  };

  return (
    <>
      <Card withBorder>
        <Stack gap={'md'}>
          <div id="header-action">
            <Grid gutter={'lg'}>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                  lg: 6,
                  xl: 6,
                }}
              >
                <Group align="left">
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
                  md: 6,
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
          </div>
          <Stack gap={'md'} id="table">
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'} highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>KODE</Table.Th>
                    <Table.Th>NAMA</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {dataMasterIcon.map((item, index) => {
                    return (
                      <Table.Tr key={item.id_inc}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.kode_icon}</Table.Td>
                        <Table.Td>{item.nama_icon}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button variant="outline" size="xs" color="blue" onClick={() => onEditButton(item.id_inc)}>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              color="red"
                              onClick={() => {
                                onDeleteButton(item.id_inc);
                              }}
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
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
              paginationSize={sizePagination}
              total={dataMasterIcon.length}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
