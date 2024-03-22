import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { MasterCategoryRepository } from '@/features/master-category/master-category.repository';
import { MasterDataRepository } from '@/features/master-data/master-data.repository';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  TextInput,
  Select,
  Textarea,
  Group,
  Button,
  NumberInput,
  Radio,
  LoadingOverlay,
  Tabs,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconForms, IconSettings } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect, useState } from 'react';

type FormTabType = 'form' | 'parameter';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Data Badan Usaha">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      master_data_parent_id: undefined as string | undefined,
      master_category_id: undefined as string | undefined,
      code: '',
      name: '',
      description: '',
      status: 'active',

      parameter1_key: '',
      parameter1_value: '',
      parameter2_key: '',
      parameter2_value: '',
      parameter3_key: '',
      parameter3_value: '',
    },
    validate: {
      code: (value) => (value.trim() === '' ? 'Kode tidak boleh kosong' : undefined),
      name: (value) => (value.trim() === '' ? 'Nama tidak boleh kosong' : undefined),
      description: (value) => (value.trim() === '' ? 'Keterangan tidak boleh kosong' : undefined),
      status: (value) => (value.trim() === '' ? 'Status tidak boleh kosong' : undefined),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const [activeTab, setActiveTab] = useState<FormTabType>('form');

  const { data: dataMasterData, isLoading: isLoadingMasterData } = MasterDataRepository.hooks.useById(
    id as string | undefined,
  );

  const { data: dataMasterCategory } = MasterCategoryRepository.hooks.useList({
    page: 1,
    pageSize: 1000,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      const body = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        master_category_id: values.master_category_id,
        master_data_parent_id: values.master_data_parent_id,
        parameter1_key: values.parameter1_key,
        parameter1_value: values.parameter1_value,
        parameter2_key: values.parameter2_key,
        parameter2_value: values.parameter2_value,
        parameter3_key: values.parameter3_key,
        parameter3_value: values.parameter3_value,
        created_by: jwtPayload?.userId ?? 0,
      };

      if (dataMasterData) {
        await MasterDataRepository.api.edit(`${dataMasterData.id}`, {
          ...body,
          updated_by: jwtPayload?.userId ?? 0,
        });
      } else {
        await MasterDataRepository.api.create(body);
      }

      notifications.show({
        title: 'Success',
        message: `Data berhasil ${isEdit ? 'diedit' : 'ditambahkan'}`,
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

    if (dataMasterData) {
      if (dataMasterData.master_data_parent_id) {
        setFieldValue('master_data_parent_id', `${dataMasterData.master_data_parent_id}`);
      }
      if (dataMasterData.master_category_id) {
        setFieldValue('master_category_id', `${dataMasterData.master_category_id}`);
      }

      setFieldValue('code', dataMasterData.code);
      setFieldValue('name', dataMasterData.name);
      setFieldValue('description', `${dataMasterData.description}`);
      setFieldValue('status', dataMasterData.status);
      setFieldValue('parameter1_key', `${dataMasterData.parameter1_key}`);
      setFieldValue('parameter1_value', `${dataMasterData.parameter1_value}`);
      setFieldValue('parameter2_key', `${dataMasterData.parameter2_key}`);
      setFieldValue('parameter2_value', `${dataMasterData.parameter2_value}`);
      setFieldValue('parameter3_key', `${dataMasterData.parameter3_key}`);
      setFieldValue('parameter3_value', `${dataMasterData.parameter3_value}`);
    }

    return () => {};
  }, [dataMasterData, isReady, setFieldValue]);

  return (
    <>
      <LoadingOverlay visible={isLoadingMasterData} />
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
            <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab as FormTabType)}>
              <Tabs.List>
                <Tabs.Tab value="form" leftSection={<IconForms size="0.8rem" />}>
                  FORM
                </Tabs.Tab>

                <Tabs.Tab value="parameter" leftSection={<IconSettings size="0.8rem" />}>
                  PARAMETER
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="form" pt="xs">
                <Stack gap={'md'}>
                  <Select
                    label="Master Category"
                    placeholder="Pilih Master Category"
                    data={dataMasterCategory.map((item) => ({ value: `${item.id}`, label: item.name }))}
                    nothingFoundMessage="No options"
                    searchable
                    clearable
                    {...form.getInputProps('kode_category')}
                  />
                  <TextInput
                    label="Kode Master Data"
                    placeholder="Kode Master Data"
                    {...form.getInputProps('kode_master_data')}
                  />
                  <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('nama')} />
                  <Textarea label="Keterangan" placeholder="Keterangan" {...form.getInputProps('keterangan')} />
                  <NumberInput
                    placeholder="Masukkan Urutan"
                    label="Urutan"
                    name="order"
                    {...form.getInputProps('order')}
                  />
                  <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                    <Group pt={'sm'}>
                      <Radio value="aktif" label="Aktif" />
                      <Radio value="tidak_aktif" label="Tidak Aktif" />
                    </Group>
                  </Radio.Group>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="parameter" pt="xs">
                <Stack gap={'md'}>
                  <TextInput
                    label="Parameter 1 Key"
                    placeholder="Parameter 1 Key"
                    {...form.getInputProps('parameter1_key')}
                  />
                  <TextInput
                    label="Parameter 1 Value"
                    placeholder="Parameter 1 Value"
                    {...form.getInputProps('parameter1_value')}
                  />
                  <TextInput
                    label="Parameter 2 Key"
                    placeholder="Parameter 2 Key"
                    {...form.getInputProps('parameter2_key')}
                  />
                  <TextInput
                    label="Parameter 2 Value"
                    placeholder="Parameter 2 Value"
                    {...form.getInputProps('parameter2_value')}
                  />
                  <TextInput
                    label="Parameter 3 Key"
                    placeholder="Parameter 3 Key"
                    {...form.getInputProps('parameter3_key')}
                  />
                  <TextInput
                    label="Parameter 3 Value"
                    placeholder="Parameter 3 Value"
                    {...form.getInputProps('parameter3_value')}
                  />
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Stack>
      </form>
    </>
  );
}
