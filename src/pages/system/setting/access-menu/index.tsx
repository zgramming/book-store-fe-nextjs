import AdminLayout from '@/components/layout/AdminLayout';
import { Badge, Button, Card, Grid, Group, Stack, Table, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import { useRouter } from 'next/router';
import { useDebouncedState } from '@mantine/hooks';
import { RoleRepository } from '@/features/role/role.repository';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Akses Menu">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [paginationSize, setPaginationSize] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);

  const { data: dataGroup, total } = RoleRepository.hooks.useList({
    page: activePagination,
    pageSize: Number(paginationSize),
    search: searchQuery,
  });

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.length === 0 || value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  const onEdit = (kodeGroup: string) => {
    push({
      pathname: 'access-menu/form',
      query: {
        action: 'edit',
        id: kodeGroup,
      },
    });
  };

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
                <Group gap={'xs'} align="end" justify="end"></Group>
              </Grid.Col>
            </Grid>
          </div>
          <Stack gap={'md'} id="table">
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'} highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>No</Table.Th>
                    <Table.Th>Kode</Table.Th>
                    <Table.Th>Nama</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Aksi</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {dataGroup.map((item, index: number) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.code}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>
                          {item.status == 'active' ? (
                            <Badge color="green">Aktif</Badge>
                          ) : (
                            <Badge color="red">Tidak Aktif</Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap={'xs'}>
                            <Button variant="outline" size="xs" color="blue" onClick={() => onEdit(`${item.id}`)}>
                              Edit
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
              onChangePagination={(value) => setPagination(value)}
              onChangePaginationSize={(value) => setPaginationSize(value)}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
