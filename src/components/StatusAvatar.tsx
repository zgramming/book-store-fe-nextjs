import { Group, Tooltip, Avatar, DefaultMantineColor, GroupProps } from '@mantine/core';

type StatusAvatarProps = {
  color?: DefaultMantineColor;
  tooltip?: string;
  onClick?: () => void;
  justify?: GroupProps['justify'];
};
function StatusAvatar({ color = 'green', tooltip, justify, onClick }: StatusAvatarProps) {
  return (
    <Group justify={justify}>
      <Tooltip label={tooltip || 'Default Tooltip'}>
        <Avatar
          radius={'xl'}
          size={'sm'}
          color={color}
          variant="filled"
          className={`
            ${onClick ? 'cursor-pointer' : ''}
          `}
          onClick={onClick}
        >
          &nbsp;
        </Avatar>
      </Tooltip>
    </Group>
  );
}

export default StatusAvatar;
