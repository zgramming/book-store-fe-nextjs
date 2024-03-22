import AdminLayout from '@/components/layout/AdminLayout';
import { ActionIcon, Badge, Button, Card, Grid, Group, Select, Stack, Table, TextInput } from '@mantine/core';
import { IconLock, IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import ButtonEdit from '@/components/ButtonEdit';
import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import { useRouter } from 'next/router';
import { useDebouncedState } from '@mantine/hooks';
import { UserRepository } from '@/features/user/user.repository';
import { RoleRepository } from '@/features/role/role.repository';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="User">{page}</AdminLayout>;
};

export default function Page() {
  const { push, isReady, query } = useRouter();
  const { group: queryGroup } = query;
  const [activePagination, setPagination] = useState(1);
  const [paginationSize, setPaginationSize] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();

  const { data, total } = UserRepository.hooks.useList({
    page: activePagination,
    pageSize: Number(paginationSize),
    search: searchQuery,
    roleId: selectedGroup,
  });

  const { data: groupData } = RoleRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });

  const onSelectedGroupHandler = (value: string | null) => {
    if (value === null) {
      setSelectedGroup(undefined);

      push({
        pathname: 'user',
      });
    } else {
      setSelectedGroup(value);

      push({
        pathname: 'user',
        query: {
          group: value,
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

  const onAddHandler = () => {
    push({
      pathname: 'user/form/new',
    });
  };

  const onEditHandler = (id: string) => {
    push({
      pathname: `user/form/${id}`,
    });
  };

  const onChangePasswordHandler = async (id: string) => {
    push({
      pathname: 'user/change-password',
      query: {
        id,
        action: 'change-password',
      },
    });
  };

  useEffect(() => {
    if (!isReady) return;

    if (queryGroup) {
      setSelectedGroup(queryGroup as string);
    }

    return () => {};
  }, [isReady, queryGroup]);

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
                    value={selectedGroup}
                    placeholder="Pilih Group"
                    searchable
                    clearable
                    data={groupData.map((item) => ({
                      label: item.name,
                      value: `${item.id}`,
                    }))}
                    onChange={onSelectedGroupHandler}
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
                    <Table.Th>Group</Table.Th>
                    <Table.Th>Nama</Table.Th>
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Aksi</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {data.map((item, index: number) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.role.name}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.username}</Table.Td>
                        <Table.Td>
                          {item.status == 'active' ? (
                            <Badge color="green">Aktif</Badge>
                          ) : (
                            <Badge color="red">Tidak Aktif</Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap={'xs'}>
                            <ButtonEdit onClick={() => onEditHandler(`${item.id}`)} />
                            <ActionIcon
                              variant="filled"
                              color="lime"
                              aria-label="Change Password"
                              onClick={() => onChangePasswordHandler(`${item.id}`)}
                            >
                              <IconLock size={20} />
                            </ActionIcon>
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
              paginationSize={paginationSize}
              onChangePaginationSize={setPaginationSize}
              total={total}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
