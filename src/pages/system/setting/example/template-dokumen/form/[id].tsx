import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { TemplateDokumenRepository } from '@/features/template-dokumen/template-dokumen.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect, useRef } from 'react';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import SunEditorCore from 'suneditor/src/lib/core';
const SunTextEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Khusus - Template Dokumen">{page}</AdminLayout>;

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);

  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      template: '',
      status: 't' as string,
    },
    validate: {
      code: (val) => (val.length === 0 ? 'Kode tidak boleh kosong' : null),
      name: (val) => (val.length === 0 ? 'Nama tidak boleh kosong' : null),
      template: (val) => (val.length === 0 ? 'Template tidak boleh kosong' : null),
      status: (val) => (val.length === 0 ? 'Status tidak boleh kosong' : null),
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue, values } = form;

  const sunEditorRef = useRef<SunEditorCore | undefined>();
  const { data: dataTemplateDokumen, isLoading } = TemplateDokumenRepository.hooks.useById(id as string | undefined);

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    sunEditorRef.current = sunEditor;
  };

  const onChangeSunEditor = (content: string) => {
    setFieldValue('template', content);
  };

  const onSubmit = async (values: any) => {
    try {
      const repository = TemplateDokumenRepository.api;
      const userId = jwtPayload?.userId ?? 0;

      if (dataTemplateDokumen) {
        await repository.edit(id as string, {
          code: values.kode,
          name: values.template,
          template: values.template,
          status: values.status,
          updated_by: userId,
        });
      } else {
        await repository.create({
          code: values.code,
          name: values.name,
          template: values.template,
          status: values.status,
          created_by: userId,
        });
      }

      notifications.show({
        title: 'Sukses',
        message: `Template Dokumen berhasil ${dataTemplateDokumen ? 'diubah' : 'ditambahkan'}`,
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

    if (dataTemplateDokumen) {
      setFieldValue('code', dataTemplateDokumen.code);
      setFieldValue('name', dataTemplateDokumen.name);
      setFieldValue('template', dataTemplateDokumen.template);
      setFieldValue('status', dataTemplateDokumen.status);
    }

    return () => {};
  }, [dataTemplateDokumen, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
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
                  <TextInput label="Kode" placeholder="Kode" {...form.getInputProps('code')} />
                  <TextInput label="Nama" placeholder="Nama" {...form.getInputProps('name')} />
                  <SunTextEditor
                    lang={'en'}
                    placeholder="Masukkan template dokumen disini..."
                    getSunEditorInstance={getSunEditorInstance}
                    setContents={values.template}
                    width="100%"
                    height="500px"
                    onChange={onChangeSunEditor}
                    setOptions={{
                      fontSize: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60],
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor', 'textStyle'],
                        ['removeFormat'],
                        '/', // Line break
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                        /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['preview', 'print'],
                        ['save'],
                        // ['save', 'template'],
                        /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
                      ],
                    }}
                  />
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
