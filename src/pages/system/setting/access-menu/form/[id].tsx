import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { AccessMenuRepository } from '@/features/access-menu/access-menu.repository';
import { AccessibleModul } from '@/features/access-menu/entities/access-menu-by-role-and-category-modul.entity';
import { CategoryModulRepository } from '@/features/category-modul/category-modul.repository';
import { RoleRepository } from '@/features/role/role.repository';
import { availableAccessAction } from '@/utils/constant';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  Text,
  Group,
  Button,
  Checkbox,
  ActionIcon,
  Badge,
  Collapse,
  Flex,
  Paper,
  Space,
  TextInput,
  Divider,
  Select,
  SimpleGrid,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect, useState } from 'react';

interface AccessModulItemProps {
  form: any;
  item: AccessibleModul;
}

const delimiter = '|||';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Access Menu">{page}</AdminLayout>;

function AccessModulItem({ item, form }: AccessModulItemProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card key={item.id} withBorder shadow="md">
      <Stack>
        <Flex direction={'row'} align={'center'} justify={'space-between'}>
          <div className="font-bold">
            {item.name} <Badge>{item.menus.length} Menu</Badge>
          </div>
          <ActionIcon variant="subtle">
            {opened ? <IconChevronUp onClick={toggle} /> : <IconChevronDown onClick={toggle} />}
          </ActionIcon>
        </Flex>
        <Collapse in={opened}>
          <Space h={'xs'} />
          {item.menus.map((menu) => {
            return (
              <Paper key={menu.id} shadow="xs" p={'md'} mb={'md'}>
                <Stack>
                  <Text className="font-medium">{menu.name}</Text>
                  <Checkbox.Group
                    description="Select your access action"
                    withAsterisk
                    {...form.getInputProps('access')}
                  >
                    <Group mt="xs">
                      {availableAccessAction.map((access) => {
                        const value = `${menu.id}${delimiter}${access}`;
                        return <Checkbox key={value} value={value} label={access.toUpperCase()} checked={true} />;
                      })}
                    </Group>
                  </Checkbox.Group>
                </Stack>
              </Paper>
            );
          })}
        </Collapse>
      </Stack>
    </Card>
  );
}

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      // Format value: `${menuId}|||${permission}`
      access: [] as string[],
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue, setValues } = form;

  const [categoryId, setCategoryId] = useState<string | undefined>();
  const { data: dataGroup } = RoleRepository.hooks.useById(id as string | undefined);
  const { data: dataCategoryModul } = CategoryModulRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });
  // const { data: dataSelectedGroup, isLoading: isLoadingSelectedGroup } = GroupRepository.hooks.useListgroupForAppMenu({
  //   id: id as string | undefined,
  //   categoryId,
  // });
  const { data: dataAccessMenu, isLoading: isLoadingAccessMenu } = AccessMenuRepository.hooks.useByRoleAndCategoryModul(
    id as string | undefined,
    categoryId,
  );

  const onChangeFilterCategoryModul = (value: string | null) => {
    if (value) {
      setCategoryId(value);
    } else {
      setCategoryId(undefined);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (!dataGroup) {
        return;
      }

      const mappingAccess: {
        app_menu_id: string;
        role_id: string;
        permission: string;
      }[] = values.access.map((item: string) => {
        const [idMenu, permission] = item.split('|||');
        return {
          app_menu_id: idMenu,
          role_id: dataGroup.id,
          permission,
        };
      });

      const groupedAccessByMenuId = Object.groupBy(mappingAccess, (item) => item.app_menu_id);
      const mappingGroupedAccess = Object.keys(groupedAccessByMenuId).map((menuId) => {
        const permissions = mappingAccess.filter((item) => item.app_menu_id === menuId).map((item) => item.permission);
        return {
          app_menu_id: +menuId,
          role_id: dataGroup.id,
          permissions,
          created_by: jwtPayload?.userId ?? 0,
        };
      });

      await AccessMenuRepository.api.create(mappingGroupedAccess);

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

    if (dataGroup) {
      setFieldValue('code', `${dataGroup?.id}`);
      setFieldValue('name', `${dataGroup?.name}`);
    }

    if (dataAccessMenu) {
      const groupedAccessByMenuId = Object.groupBy(dataAccessMenu.selectedAccessMenu, (item) => item.app_menu_id);

      const arrAccess = [];

      for (const [menuId, value] of Object.entries(groupedAccessByMenuId)) {
        for (const item of value ?? []) {
          const access = `${menuId}${delimiter}${item.permissions}`;
          arrAccess.push(access);
        }
      }

      setValues({
        access: arrAccess,
      });
    }

    return () => {};
  }, [dataGroup, isReady, setFieldValue, setValues, dataAccessMenu]);

  return (
    <>
      <LoadingOverlay visible={isLoadingAccessMenu} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'xl'}>
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
              Card Section
            </Card.Section>
            <Stack gap={'md'}>
              <TextInput placeholder="Your name" label="Group Code" disabled {...form.getInputProps('code')} />
              <TextInput placeholder="Your role" label="Group Name" disabled {...form.getInputProps('name')} />
              <Divider />
              <Group justify="right">
                <Select
                  placeholder="Pilih Kategori Modul"
                  data={dataCategoryModul.map((item) => ({
                    value: `${item.id}`,
                    label: item.name,
                  }))}
                  nothingFoundMessage="No options"
                  searchable
                  clearable
                  onChange={(value) => onChangeFilterCategoryModul(value || '')}
                />
              </Group>
              <SimpleGrid cols={1}>
                {dataAccessMenu?.accessibleModul.map((item) => {
                  return <AccessModulItem key={item.id} form={form} item={item} />;
                })}
              </SimpleGrid>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
