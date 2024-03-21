import { ActionIcon } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';

type ButtonEditProps = {
  onClick: () => void;
};
const ButtonEdit = ({ onClick }: ButtonEditProps) => {
  return (
    <ActionIcon variant="filled" color="blue" aria-label="Edit" onClick={onClick}>
      <IconPencil size={20} />
    </ActionIcon>
  );
};

export default ButtonEdit;
