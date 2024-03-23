import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { AccessMenuRepository } from '@/features/access-menu/access-menu.repository';
import { AccessMenuCreateDTO } from '@/features/access-menu/dto/access-menu-create.dto';
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
interface MappingAccessMenu {
  app_category_modul_id: string;
  app_modul_id: string;
  app_menu_id: string;
  role_id: string;
  permission: string;
}

const delimiter = '|||';
const combinationValue = (appCategoryModulId: string, appModulId: string, appMenuId: string, permission: string) => {
  return `${appCategoryModulId}${delimiter}${appModulId}${delimiter}${appMenuId}${delimiter}${permission}`;
};

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
                        // Format combination : AppCategoryModulId|||AppModulId|||AppMenuId|||Permission
                        const value = combinationValue(
                          `${menu.app_category_modul_id}`,
                          `${menu.app_modul_id}`,
                          `${menu.id}`,
                          access,
                        );
                        return <Checkbox key={value} value={value} label={access.toUpperCase()} />;
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

  const { id } = query;
  const { setFieldValue } = form;

  const [categoryId, setCategoryId] = useState<string | undefined>();
  const { data: dataGroup } = RoleRepository.hooks.useById(id as string | undefined);
  const { data: dataCategoryModul } = CategoryModulRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });

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
      if (!dataGroup) {
        return;
      }

      const mappingAccess: MappingAccessMenu[] = values.access.map((item: string) => {
        const [AppCategoryModulId, AppModulId, AppMenuId, permission] = item.split('|||');
        return {
          app_category_modul_id: AppCategoryModulId,
          app_modul_id: AppModulId,
          app_menu_id: AppMenuId,
          role_id: dataGroup.id,
          permission,
        };
      });

      const groupingAccessByCombination: {
        [key: string]: MappingAccessMenu[];
      } = {};

      mappingAccess.forEach((item) => {
        const value = combinationValue(
          item.app_category_modul_id,
          item.app_modul_id,
          item.app_menu_id,
          item.permission,
        );
        if (!groupingAccessByCombination[value]) {
          groupingAccessByCombination[value] = [];
        }

        groupingAccessByCombination[value].push(item);
      });

      const mappingGroupedAccess: AccessMenuCreateDTO[] = Object.keys(groupingAccessByCombination).map(
        (combination) => {
          const [appCategoryModulId, appModulId, menuId] = combination.split(delimiter);
          const permissions = mappingAccess
            .filter((item) => item.app_menu_id === menuId)
            .map((item) => item.permission);
          return {
            app_category_modul_id: +appCategoryModulId,
            app_modul_id: +appModulId,
            app_menu_id: +menuId,
            role_id: dataGroup.id,
            permissions,
            created_by: jwtPayload?.userId ?? 0,
          };
        },
      );

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

  // Set initial value
  useEffect(() => {
    if (!isReady) return;

    if (dataGroup) {
      setFieldValue('code', `${dataGroup?.id}`);
      setFieldValue('name', `${dataGroup?.name}`);
    }

    return () => {};
  }, [dataGroup, isReady, setFieldValue]);

  // Set Selected Access Menu
  useEffect(() => {
    if (dataAccessMenu.selectedAccessMenu) {
      const selectedAccessMenu = dataAccessMenu.selectedAccessMenu;
      const groupedAccessByMenuId: {
        [key: string]: {
          app_category_modul_id: string;
          app_modul_id: string;
          app_menu_id: string;
          role_id: string;
          permissions: string[];
        }[];
      } = {};

      selectedAccessMenu.forEach((item) => {
        const menuId = `${item.app_menu_id}`;

        if (!groupedAccessByMenuId[menuId]) {
          groupedAccessByMenuId[menuId] = [];
        }

        groupedAccessByMenuId[menuId].push({
          app_category_modul_id: `${item.app_category_modul_id}`,
          app_modul_id: `${item.app_modul_id}`,
          app_menu_id: `${menuId}`,
          permissions: item.permissions,
          role_id: `${item.role_id}`,
        });
      });

      const arrAccess: string[] = [];

      for (const [keyMenuId, value] of Object.entries(groupedAccessByMenuId)) {
        for (const item of value ?? []) {
          item.permissions.forEach((permission) => {
            const value = combinationValue(item.app_category_modul_id, item.app_modul_id, keyMenuId, permission);

            arrAccess.push(value);
          });
        }
      }

      setFieldValue('access', arrAccess);
    }
  }, [isReady, dataAccessMenu.selectedAccessMenu, setFieldValue]);

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
              Access Menu
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
