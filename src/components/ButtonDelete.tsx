import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type ButtonDeleteProps = {
  onClick: () => void;
};
const ButtonDelete = ({ onClick }: ButtonDeleteProps) => {
  return (
    <ActionIcon variant="subtle" color="red" aria-label="Delete" onClick={onClick}>
      <IconTrash size={20} />
    </ActionIcon>
  );
};

export default ButtonDelete;