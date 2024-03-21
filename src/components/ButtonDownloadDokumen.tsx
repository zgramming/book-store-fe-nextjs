import { appConfig } from '@/config/app';
import { ActionIcon } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import Link from 'next/link';

type ButtonDownloadFileProps = {
  filename: string;
};
const ButtonDownloadDokumen = ({ filename }: ButtonDownloadFileProps) => {

  return (
    <Link href={`${appConfig.apiUrl}/file?fileName=${filename}`} target='_blank' download>
      <ActionIcon key={'pks_print'} variant="default" size={'lg'}>
        <IconDownload size="1rem" />
      </ActionIcon>
    </Link>
  );
};

export default ButtonDownloadDokumen;
