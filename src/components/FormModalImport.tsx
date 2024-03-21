import { Stack, FileInput,   Group, Button, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconUpload, IconDownload } from '@tabler/icons-react';

type FormModalImportProps = {
  onDownloadTemplate?: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: any) => void;
};
const FormModalImport = ({ onDownloadTemplate, onSubmit }: FormModalImportProps) => {
  const form = useForm();

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap={'md'}>
        <FileInput label="File" placeholder="File" rightSection={<IconUpload size={rem(14)} />} required />
        <div className="flex flex-row items-center justify-between">
          <Button variant="subtle" rightSection={<IconDownload size={rem(14)} />} onClick={onDownloadTemplate}>
            Download template
          </Button>
          <Group justify="right">
            <Button
              variant="default"
              onClick={() => {
                modals.closeAll();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default FormModalImport;
