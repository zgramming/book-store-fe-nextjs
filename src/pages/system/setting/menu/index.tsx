import AdminLayout from '@/components/layout/AdminLayout';
import { Badge, Button, Card, Grid, Group, Select, Stack, Table, TextInput } from '@mantine/core';

import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import { useRouter } from 'next/router';
import { getErrorMessageAxios } from '@/utils/function';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useDebouncedState } from '@mantine/hooks';
import { MenuRepository } from '@/features/menu/menu.repository';
import { CategoryModulRepository } from '@/features/category-modul/category-modul.repository';
import { ModulRepository } from '@/features/modul/modul.repository';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Menu">{page}</AdminLayout>;
};

export default function Page() {
  const { push, query, isReady } = useRouter();
  const { kategoriModul: queryKategoriModul, modul: queryModul } = query;
  const [activePagination, setPagination] = useState(1);
  const [paginationSize, setPaginationSize] = useState<PaginationSize>('100');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [selectedKategoriModul, setSelectedKategoriModul] = useState<string | undefined>(undefined);
  const [selectedModul, setSelectedModul] = useState<string | undefined>(undefined);

  const { data, mutate, total } = MenuRepository.hooks.useList({
    page: activePagination,
    pageSize: Number(paginationSize),
    search: searchQuery,
    modul_id: selectedModul,
    category_modul_id: selectedKategoriModul,
  });

  const { data: kategoriModulData } = CategoryModulRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });

  const { data: modulData } = ModulRepository.hooks.useByCategoryModul(selectedKategoriModul);

  const onSelectedKategoriModul = (value: string | null) => {
    if (value === null) {
      setSelectedKategoriModul(undefined);
      setSelectedModul(undefined);
      push({
        pathname: 'menu',
      });
    } else {
      setSelectedKategoriModul(value);
      push({
        pathname: 'menu',
        query: {
          kategoriModul: value,
        },
      });
    }
  };

  const onSelectedModul = (value: string | null) => {
    if (value === null) {
      setSelectedModul(undefined);
      push({
        pathname: 'menu',
        query: {
          kategoriModul: selectedKategoriModul,
        },
      });
    } else {
      setSelectedModul(value);
      push({
        pathname: 'menu',
        query: {
          kategoriModul: selectedKategoriModul,
          modul: value,
        },
      });
    }
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.length === 0 || value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  const onDeleteHandler = async (id: string) => {
    try {
      await MenuRepository.api.delete(id);
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Data dengan id ${id} berhasil dihapus`,
      });

      mutate();
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

  const onAddHandler = () => {
    push({
      pathname: 'menu/form/new',
    });
  };

  const onEditHandler = (id: string) => {
    push({
      pathname: `menu/form/${id}`,
    });
  };

  useEffect(() => {
    if (!isReady) return;

    if (queryKategoriModul) {
      setSelectedKategoriModul(queryKategoriModul as string);
    }

    if (queryModul) {
      setSelectedModul(queryModul as string);
    }
    return () => {};
  }, [isReady, queryKategoriModul, queryModul]);

  return (
    <>
      <Card withBorder>
        <Stack>
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
                  <Select
                    value={selectedKategoriModul}
                    placeholder="Pilih Kategori Modul"
                    searchable
                    clearable
                    data={kategoriModulData.map((item) => ({
                      value: `${item.id}`,
                      label: item.name,
                    }))}
                    onChange={onSelectedKategoriModul}
                  />
                  <Select
                    value={selectedModul}
                    placeholder="Pilih Modul"
                    searchable
                    clearable
                    data={modulData.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    onChange={onSelectedModul}
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
                <Group gap={'xs'} align="end" justify="end">
                  <Button leftSection={<IconPlus />} variant="filled" onClick={onAddHandler}>
                    Tambah
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </div>
          <Stack gap={'md'} id="table">
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'} highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>No</Table.Th>
                    <Table.Th>Category Modul</Table.Th>
                    <Table.Th>Modul</Table.Th>
                    <Table.Th>Kode</Table.Th>
                    <Table.Th>Nama</Table.Th>
                    <Table.Th>Urutan</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Aksi</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data &&
                    data.map((item, index: number) => {
                      return (
                        <Table.Tr key={item.id}>
                          <Table.Td>{index + 1}</Table.Td>
                          <Table.Td>{item.app_category_modul.name}</Table.Td>
                          <Table.Td>{item.app_modul.name}</Table.Td>
                          <Table.Td>{item.code}</Table.Td>
                          <Table.Td>{item.name}</Table.Td>
                          <Table.Td>{item.order}</Table.Td>
                          <Table.Td>
                            {item.status == 'active' ? (
                              <Badge color="green">Aktif</Badge>
                            ) : (
                              <Badge color="red">Tidak Aktif</Badge>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Group gap={'xs'}>
                              <Button
                                variant="outline"
                                size="xs"
                                color="blue"
                                onClick={() => onEditHandler(`${item.id}`)}
                              >
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
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              activePagination={activePagination}
              paginationSize={paginationSize}
              total={total}
              onChangePagination={(page: number) => setPagination(page)}
              onChangePaginationSize={(size: PaginationSize) => setPaginationSize(size)}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
