import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { MasterKhusuRepository } from '@/features/setting/master-khusus/master-khusus.repository';
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
      kode: '',
      template: '',
      status: 't' as string,
    },
    validate: {
      kode: (value) => (value ? undefined : 'Kode tidak boleh kosong'),
      // template: (value) => (value ? undefined : 'Template tidak boleh kosong'),
      status: (value) => (value ? undefined : 'Status tidak boleh kosong'),
    },
  });

  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue, values } = form;

  const sunEditorRef = useRef<SunEditorCore | undefined>();
  const { data: dataTemplateDokumen, isLoading } = MasterKhusuRepository.hooks.templateDokumen.useById(
    id as string | undefined,
  );

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    sunEditorRef.current = sunEditor;
  };

  const onChangeSunEditor = (content: string) => {
    setFieldValue('template', content);
  };

  const onSubmit = async (values: any) => {
    try {
      const repository = MasterKhusuRepository.api.templateDokumen;
      const userId = jwtPayload?.userId ?? '';

      if (dataTemplateDokumen) {
        await repository.update(id as string, {
          kode: values.kode,
          isi: values.template,
          status: values.status,
          updated_by: userId,
        });
      } else {
        await repository.create({
          kode: values.kode,
          isi: values.template,
          status: values.status,
          create_by: userId,
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
      setFieldValue('kode', dataTemplateDokumen.kode);
      setFieldValue('status', dataTemplateDokumen.status);

      if (dataTemplateDokumen.isi) {
        console.log({ dataTemplateDokumen });

        setFieldValue('template', dataTemplateDokumen.isi);
      }
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
                  <TextInput label="Kode" placeholder="Kode" {...form.getInputProps('kode')} />
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
