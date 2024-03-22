import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { MasterCategoryRepository } from '@/features/master-category/master-category.repository';
import { MasterDataRepository } from '@/features/master-data/master-data.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Badge, Button, Card, Flex, Grid, Group, LoadingOverlay, Select, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Master Data">{page}</AdminLayout>;
};

export default function Page() {
  const { push, isReady, query } = useRouter();
  const { master_category_id: masterCategoryIDQuery } = query;

  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [selectedCategoryID, setSelectedCategoryID] = useState<string | undefined>();

  const { data: dataMasterCategory } = MasterCategoryRepository.hooks.useList({
    page: 1,
    pageSize: 1000,
  });

  const {
    data: dataMasterData,
    isLoading: isLoadingMasterData,
    total: totalMasterData,
    mutate: mutateMasterData,
  } = MasterDataRepository.hooks.useList({
    page: activePagination,
    pageSize: parseInt(sizePagination),
    search: searchQuery,
    master_category_id: selectedCategoryID,
  });

  const onSelectedCategory = (value: string | null) => {
    if (value) {
      setSelectedCategoryID(value);
      push({
        pathname: '/master-data',
        query: {
          master_category_id: value,
        },
      });
    } else {
      setSelectedCategoryID(undefined);
      push({
        pathname: '/master-data',
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

  const onAddButton = () => {
    push('master-data/form/new');
  };

  const onEditButton = (id: string) => {
    push({
      pathname: `master-data/form/${id}`,
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      await MasterDataRepository.api.delete(id);
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Data dengan id ${id} berhasil dihapus`,
      });

      mutateMasterData();
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

  // Set filter state from query url when page is ready (isReady)
  useEffect(() => {
    if (!isReady) return;

    if (masterCategoryIDQuery) {
      setSelectedCategoryID(masterCategoryIDQuery as string);
    }

    return () => {};
  }, [isReady, masterCategoryIDQuery]);

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
                <Select
                  value={selectedCategoryID}
                  placeholder="Pilih Category"
                  searchable
                  clearable
                  data={dataMasterCategory.map((item) => ({
                    label: item.name,
                    value: `${item.id}`,
                  }))}
                  onChange={onSelectedCategory}
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
            <LoadingOverlay visible={isLoadingMasterData} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>KODE CATEGORY</Table.Th>
                    <Table.Th>KODE DATA</Table.Th>
                    <Table.Th>NAMA</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>CREATED AT</Table.Th>
                    <Table.Th>UPDATED AT</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {dataMasterData.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.master_category.code}</Table.Td>
                        <Table.Td>{item.code}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>
                          {item.status == 'active' ? (
                            <Badge color="green">Aktif</Badge>
                          ) : (
                            <Badge color="red">Tidak Aktif</Badge>
                          )}
                        </Table.Td>
                        <Table.Td>{readableDate(item.created_at)}</Table.Td>
                        <Table.Td>{readableDate(item.updated_at)}</Table.Td>
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
              total={totalMasterData}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
