import AdminLayout from '@/components/layout/AdminLayout';
import { ModulCategoryRepository } from '@/features/setting/category_module/category-module.repository';
import { GroupRepository } from '@/features/setting/group/group.repository';
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
import { ReactNode, useEffect, useState } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Access Menu">{page}</AdminLayout>;

function AccessModulItem({ item, form }: { item: any; form: any }) {
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
          {item.menus.map((menu: any) => {
            return (
              <Paper key={menu.code} shadow="xs" p={'md'} mb={'md'}>
                <Stack>
                  <Text className="font-medium">{menu.name}</Text>
                  <Checkbox.Group
                    description="Select your access action"
                    withAsterisk
                    {...form.getInputProps('access')}
                  >
                    <Group mt="xs">
                      {availableAccessAction.map((access) => {
                        const delimiter = '|||';
                        const value = `${menu.code}${delimiter}${access}`;
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
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      access: [] as string[],
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue, setValues } = form;

  const [categoryId, setCategoryId] = useState('');
  const { data: dataGroup, isLoading: isLoadingGroup } = GroupRepository.hooks.useByIdGroup(id as string | undefined);
  const { data: dataCategoryModul } = ModulCategoryRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });
  const { data: dataSelectedGroup, isLoading: isLoadingSelectedGroup } = GroupRepository.hooks.useListgroupForAppMenu({
    id: id as string | undefined,
    categoryId,
  });

  const onChangeFilterCategoryModul = (value: string) => {
    setCategoryId(value);
  };

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      const listAccess = values.access.map((item: any) => {
        const [idMenu, status] = item.split('|||');
        return {
          kodeMenu: idMenu,
          access: status,
        };
      });

      await GroupRepository.api.updateAccessMenuGroup({
        select_data: listAccess,
        group_id: id,
      });

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
      setFieldValue('code', `${dataGroup?.kodeGroup}`);
      setFieldValue('name', `${dataGroup?.namaGroup}`);
    }

    if (dataSelectedGroup) {
      const selectedAccess = dataSelectedGroup?.accessMenu.map((item: any) => {
        const delimiter = '|||';
        const value = `${item.kodeMenu}${delimiter}${item.statusGroup}`;
        return value;
      });

      setValues({
        access: selectedAccess,
      });
    }

    return () => {};
  }, [dataGroup, dataSelectedGroup, isReady, setFieldValue, setValues]);

  return (
    <>
      <LoadingOverlay visible={isLoadingGroup || isLoadingSelectedGroup} />
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
                  data={dataCategoryModul.map((item: any) => ({
                    value: `${item.kodeKategori}`,
                    label: item.namaKategori,
                  }))}
                  nothingFoundMessage="No options"
                  searchable
                  clearable
                  onChange={(value) => onChangeFilterCategoryModul(value || '')}
                />
              </Group>
              <SimpleGrid cols={1}>
                {dataSelectedGroup?.listAllMenu.map((item: any) => {
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
