import { Tooltip, ActionIcon } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

type ActionIconFileProps = {
  url?: string;
  tooltip?: string;
  onClick?(): void;
};
const ActionIconFile = ({ url, tooltip = 'Download', onClick = () => {} }: ActionIconFileProps) => {
  return (
    <Tooltip label={tooltip} position="left" withArrow>
      <ActionIcon
        variant="default"
        size={'md'}
        onClick={() => {
          if (onClick) {
            onClick();
            return;
          }

          if (url) {
            window.open(url, '_blank');
            return;
          }
        }}
      >
        <IconFile size="1rem" />
      </ActionIcon>
    </Tooltip>
  );
};

export default ActionIconFile;
