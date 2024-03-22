import AdminLayout from '@/components/layout/AdminLayout';
import { ParameterRepository } from '@/features/parameter/parameter.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Group, Button, Radio, TextInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Parameter">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      value: '',
      status: 'active',
    },
    validate: {
      code: (value) => {
        if (!value) return 'Code tidak boleh kosong';
        return null;
      },
      name: (value) => {
        if (!value) return 'Nama tidak boleh kosong';
        return null;
      },

      value: (value) => {
        if (!value) return 'Nilai tidak boleh kosong';
        return null;
      },

      status: (value) => {
        if (!value) return 'Status tidak boleh kosong';
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataParameter, isLoading: isLoadingParameter } = ParameterRepository.hooks.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      const body = {
        nama_parameter: values.name,
        nilai_parameter: values.value,
        status_parameter: values.status === 'aktif' ? true : false,
      };

      if (dataParameter) {
        await ParameterRepository.api.edit(`${dataParameter.id}`, body);
      } else {
        await ParameterRepository.api.create(body);
      }

      notifications.show({
        title: 'Success',
        color: 'green',
        message: dataParameter ? `Data dengan kode ${dataParameter.code} berhasil diubah` : 'Data berhasil ditambahkan',
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

    if (dataParameter) {
      setFieldValue('name', dataParameter.name);
      setFieldValue('value', dataParameter.value);
      setFieldValue('status', dataParameter.status);
    }

    return () => {};
  }, [dataParameter, isReady, setFieldValue]);

  return (
    <>
      <LoadingOverlay visible={isLoadingParameter} />
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
              <TextInput placeholder="Your code" label="Code" withAsterisk {...form.getInputProps('code')} />
              <TextInput placeholder="Your Name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <TextInput placeholder="Your value" label="Value" withAsterisk {...form.getInputProps('value')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="active" label="Aktif" />
                  <Radio value="inactive" label="Tidak Aktif" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
