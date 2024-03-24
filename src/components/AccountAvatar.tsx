import { AuthenticationContext } from '@/context/AuthenticationContext';
import { UserRepository } from '@/features/user/user.repository';
import useBreakpoint from '@/hooks/useBreakpoint';
import { Menu, Avatar } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

const AccountAvatar = () => {
  const { jwtPayload, removeToken } = useContext(AuthenticationContext);
  const { isMobile } = useBreakpoint();
  const { replace } = useRouter();

  const { data: profile } = UserRepository.hooks.useById(jwtPayload?.userId ? `${jwtPayload.userId}` : undefined);

  const getFirstCharacterEachWord = (text: string) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0))
      .join(' ');
  };

  const onLogout = () => {
    // Remove token
    removeToken();

    replace('/login');
  };

  return (
    <div className="flex flex-row items-center justify-start gap-3">
      {/* <LoadingOverlay visible={isLoadingProfile} /> */}
      <div className="hidden lg:flex flex-col items-end">
        <div className="font-bold text-center">{profile?.name}</div>
        <div className="font-medium text-center">{profile?.username}</div>
      </div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Avatar color="blue" radius="xl" size={isMobile ? 'md' : 'lg'} className="cursor-pointer">
            {getFirstCharacterEachWord(profile?.name || '')}
          </Avatar>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Profile</Menu.Label>
          <Menu.Item leftSection={<IconLogout size={14} />} onClick={onLogout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default AccountAvatar;
