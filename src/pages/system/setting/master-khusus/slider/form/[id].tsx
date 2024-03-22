import ContainerInputFileActionIcon from '@/components/ContainerInputFileActionIcon';
import AdminLayout from '@/components/layout/AdminLayout';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, FileInput, Textarea, LoadingOverlay, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Slider">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      judulSlider: '',
      content: '',
      image: undefined as File | undefined,
      keteranganSlider: '',
      status: 't',
    },
    validate: {
      judulSlider: (val) => {
        if (!val) return 'Judul is required';
        return null;
      },
      // content: (val) => {
      //   if (!val) return 'Content is required';
      //   return null;
      // },
      // image: (val) => {
      //   if (!val) return 'Image is required';
      //   return null;
      // },
      keteranganSlider: (val) => {
        if (!val) return 'Keterangan is required';
        return null;
      },
      status: (val) => {
        if (!val) return 'Status is required';
        return null;
      },
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue } = form;

  const { data: dataSlider, isLoading: isLoadingSlider } = MasterKhusuRepository.hooks.slider.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });
      const repository = MasterKhusuRepository.api.slider;

      if (dataSlider) {
        await repository.update(id as string, {
          ...values,
          content: values.keteranganSlider,
        });
      } else {
        await repository.create({
          ...values,
          content: values.keteranganSlider,
        });
      }

      notifications.show({
        title: 'Success',
        message: `Slider berhasil ${dataSlider ? 'diubah' : 'ditambahkan'}`,
        color: 'teal',
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

    if (dataSlider) {
      setFieldValue('judulSlider', dataSlider.judulSlider);
      setFieldValue('keteranganSlider', dataSlider.keteranganSlider);
      setFieldValue('status', dataSlider.status);
    }

    return () => {};
  }, [dataSlider, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingSlider} />
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
              Form
            </Card.Section>
            <Grid gutter={'xl'} grow>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 12,
                }}
              >
                <Stack gap={'sm'}>
                  <TextInput label="Judul" placeholder="Judul" {...form.getInputProps('judulSlider')} />
                  <ContainerInputFileActionIcon
                    input={
                      <FileInput
                        label="Foto"
                        placeholder="Foto"
                        rightSection={<IconUpload />}
                        {...form.getInputProps('image')}
                      />
                    }
                  />
                  <Textarea label="Keterangan" placeholder="Keterangan" {...form.getInputProps('keteranganSlider')} />
                  <Radio.Group label="Status" {...form.getInputProps('status')}>
                    <Group mt={'sm'}>
                      <Radio value="t" label="Aktif" />
                      <Radio value="f" label="Tidak Aktif" />
                    </Group>
                  </Radio.Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
