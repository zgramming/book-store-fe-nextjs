import { ActionIcon, Center, Grid, Group, Modal, ScrollArea, Stack } from '@mantine/core';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import UnknownFileImage from '@images/unknown-file.png';
import { useDisclosure } from '@mantine/hooks';
import { IconEye } from '@tabler/icons-react';

const listExtensionImage = ['png', 'jpeg', 'jpg', 'gif'];
const listExtensionVideo = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];
const listExtensionAudio = ['mpeg', 'mp3', 'ogg', 'wav', 'wma'];
const listExtensionPdf = ['pdf'];
const listExtensionWord = ['doc', 'docx'];
const listExtensionExcel = ['xls', 'xlsx'];
const listExtensionPowerpoint = ['ppt', 'pptx'];

const listMimeTypeImage = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const listMimeTypeVideo = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov', 'video/wmv'];
const listMimeTypeAudio = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/wma'];
const listMimeTypePdf = ['application/pdf'];
const listMimeTypeWord = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const listMimeTypeExcel = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const listMimeTypePowerpoint = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

// const listMimeType = [
//   ...listMimeTypeImage,
//   ...listMimeTypeVideo,
//   ...listMimeTypeAudio,
//   ...listMimeTypePdf,
//   ...listMimeTypeWord,
//   ...listMimeTypeExcel,
//   ...listMimeTypePowerpoint,
// ];

const PreviewFileComponent = ({ file }: { file: File | string | null | undefined }) => {
  const [objFile, setObjFile] = useState<{
    url: string;
    file: File;
  } | null>(null);

  const urlToFile = async (url: string) => {
    const response = await fetch(`${url}`);

    const data = await response.blob();
    const contentType = response.headers.get('Content-Type') || '';
    const metadata = {
      type: contentType,
    };

    const file = new File([data], 'file', metadata);

    const urlFile = URL.createObjectURL(file);
    setObjFile({
      url: urlFile,
      file,
    });
  };

  useEffect(() => {
    if (file) {
      if (typeof file === 'string') {
        urlToFile(file);
      } else {
        const urlFile = URL.createObjectURL(file);
        setObjFile({
          url: urlFile,
          file,
        });
      }
    }
    return () => {
      setObjFile(null);
    };
  }, [file]);

  if (!objFile) {
    return null;
  }

  const { url: tempFileUrl, file: tempFile } = objFile;
  const ext = tempFile.name.split('.').pop() || '';

  if (listMimeTypeImage.includes(tempFile.type) || listExtensionImage.includes(ext)) {
    return (
      <Center className="relative">
        <Image
          src={tempFileUrl}
          alt="Preview File"
          width={500}
          height={500}
          className="object-scale-down shadow rounded h-full"
        />
      </Center>
    );
  }

  if (listMimeTypeVideo.includes(tempFile.type) || listExtensionVideo.includes(ext)) {
    return (
      <video
        controls
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <source src={tempFileUrl} type={tempFile.type} />
      </video>
    );
  }

  if (listMimeTypeAudio.includes(tempFile.type) || listExtensionAudio.includes(ext)) {
    return (
      <Center>
        <audio controls>
          <source src={tempFileUrl} type={tempFile.type} />
        </audio>
      </Center>
    );
  }

  if (listMimeTypePdf.includes(tempFile.type) || listExtensionPdf.includes(ext)) {
    return (
      <div
        className="flex justify-center items-center w-full h-screen"
        style={{
          overflow: 'auto',
        }}
      >
        <object data={tempFileUrl} type={tempFile.type} width="100%" height="100%">
          <embed src={tempFileUrl} type={tempFile.type} />
        </object>
      </div>
    );
  }

  // For mime type word, excel, powerpoint currently not support
  const isFileWord = listMimeTypeWord.includes(tempFile.type) || listExtensionWord.includes(ext);
  const isFileExcel = listMimeTypeExcel.includes(tempFile.type) || listExtensionExcel.includes(ext);
  const isFilePowerpoint = listMimeTypePowerpoint.includes(tempFile.type) || listExtensionPowerpoint.includes(ext);

  if (isFileWord || isFileExcel || isFilePowerpoint) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${tempFileUrl}`} className="w-full h-full">
          This is an embedded{' '}
          <a target="_blank" href="https://office.com">
            Microsoft Office
          </a>{' '}
          document, powered by{' '}
          <a target="_blank" href="https://office.com/webapps">
            Office
          </a>
          .
        </iframe>
      </div>
    );
  }

  // Default show icon file

  return (
    <Center>
      <Image src={UnknownFileImage} width={100} height={100} alt="Preview File" />
    </Center>
  );
};

type ContainerInputFileActionIconProps = {
  input: ReactNode;
  iconActions?: ReactNode[];
  previewFile?: File | string | null;
};
function ContainerInputFileActionIcon({ input, iconActions, previewFile }: ContainerInputFileActionIconProps) {
  const [isModalPreviewOpen, { open: openModalPreview, close: closeModalPreview }] = useDisclosure(false);
  const previewFilename = () => {
    if (!previewFile) {
      return '';
    }
    if (typeof previewFile === 'string') {
      return previewFile.split('/').pop() || '';
    }

    if (previewFile instanceof File) {
      return previewFile.name;
    }

    return '';
  };
  return (
    <>
      <Stack>
        <Grid gutter={'md'} align="end">
          <Grid.Col span={'auto'}>{input}</Grid.Col>
          {iconActions && (
            <Grid.Col span={'content'}>
              <Group gap={'xs'}>{iconActions.map((item) => item)}</Group>
            </Grid.Col>
          )}
          {previewFile && (
            <Grid.Col span={'content'}>
              <Group>
                {/* Filename */}
                <div className="text-xs text-gray-500">{previewFilename()}</div>
                <ActionIcon key={'view_file'} variant="filled" size={'lg'} color="blue" onClick={openModalPreview}>
                  <IconEye size="1rem" />
                </ActionIcon>
              </Group>
            </Grid.Col>
          )}
        </Grid>
      </Stack>
      <Modal
        title={'Preview File'}
        opened={isModalPreviewOpen}
        onClose={closeModalPreview}
        size={'xl'}
        scrollAreaComponent={ScrollArea.Autosize}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
      >
        <PreviewFileComponent file={previewFile} />
      </Modal>
    </>
  );
}

export default ContainerInputFileActionIcon;
