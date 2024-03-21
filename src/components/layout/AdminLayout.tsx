import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { ReactNode, useContext } from 'react';

import { convertRoutePathToArray, getMenuByPath } from '@/utils/function';
import { AppShell, Box, Burger, Button, ScrollArea, Stack } from '@mantine/core';

import useBreakpoint from '@/hooks/useBreakpoint';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/images/logo.png';
import { IconChevronLeft } from '@tabler/icons-react';
import NavbarMenuItem from './NavbarMenuItem';
import { SidebarLayoutContext } from '@/context/SidebarLayoutContext';
import AccountAvatar from '../AccountAvatar';
import { useRouter } from 'next/router';

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  // eslint-disable-next-line no-unused-vars
  breadcrumbsOverride?: (query: ParsedUrlQuery) => { [index: number]: string };
};

type BreadcrumbsCustomProps = {
  path: string;
  override?: { [index: number]: string };
};

// interface LinksGroupProps {
//   icon: React.FC<any>;
//   label: string;
//   link?: string;
//   initiallyOpened?: boolean;
//   links?: { label: string; link: string }[];
//   onClick?: () => void;
// }

// const mockdata: LinksGroupProps[] = [
//   { label: 'Management Group', icon: IconCategory, link: '/setting/group' },
//   { label: 'Management User', icon: IconCategory, link: '/setting/user' },
//   { label: 'Modul', icon: IconCategory, link: '/setting/modul' },
//   { label: 'Menu', icon: IconCategory, link: '/setting/menu' },
//   { label: 'Akses Modul', icon: IconCategory, link: '/setting/access_modul' },
//   { label: 'Akses Menu', icon: IconCategory, link: '/setting/access_menu' },
//   { label: 'Master Data', icon: IconCategory, link: '/setting/master_data' },
//   { label: 'Parameter', icon: IconCategory, link: '/setting/parameter' },
//   { label: 'Log', icon: IconCategory, link: '/setting/log' },
//   { label: 'Developer', icon: IconCategory, link: '/setting/developer' },
//   {
//     label: 'Example Parent Menu',
//     icon: IconCategory,
//     links: [
//       { label: 'Enable 2FA', link: '/setting/parent_menu/enable2fa' },
//       { label: 'Change password', link: '/setting/parent_menu/change_password' },
//       { label: 'Recovery codes', link: '/setting/parent_menu/recovery_codes' },
//     ],
//   },
// ];

const generateBreadcrumbs = ({ path, override }: BreadcrumbsCustomProps) => {
  const pathArray = path.split('/').filter((item) => item !== '');
  const breadcrumbs = pathArray.map((item, index) => {
    item = item.replace(/_/g, ' ');
    item = item.charAt(0).toUpperCase() + item.slice(1);

    if (override && override[index]) {
      item = override[index];
    }

    const isLastItem = index === pathArray.length - 1;

    if (isLastItem) {
      return (
        <div key={index} className={` text-blue-500`}>
          {item}
        </div>
      );
    }

    return (
      <div key={index} className={`text-black pr-1`}>
        {`${item} >`}
      </div>
    );
  });

  return breadcrumbs;
};

const LogoComponent = () => {
  const { isMobile } = useBreakpoint();

  return (
    <Link href="/" className="w-min">
      <Image
        src={Logo}
        alt="Logo"
        width={isMobile ? 150 : 250}
        style={{
          objectFit: 'cover',
        }}
      />
    </Link>
  );
};

const HeaderLayout = () => {
  const { openedSidebar, toggleSidebar } = useContext(SidebarLayoutContext);

  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return (
      <div className="flex flex-row items-center h-full px-5 lg:px-0">
        <Burger opened={openedSidebar} onClick={() => toggleSidebar()} size="sm" />
        <LogoComponent />
        <div className="grow flex flex-row items-center justify-end">
          <AccountAvatar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-end items-center h-full px-5 ">
      <AccountAvatar />
    </div>
  );
};

export default function AdminLayout({ children, breadcrumbsOverride, title }: AdminLayoutProps) {
  const { openedSidebar, toggleSidebar } = useContext(SidebarLayoutContext);

  const { pathname, query, back } = useRouter();
  // const { menus } = getInformationModulAndMenu(pathname);
  const menus = getMenuByPath(pathname);

  const routePath = convertRoutePathToArray(pathname).map((item) => item.toUpperCase());

  return (
    <>
      <Head>
        <title>{routePath.length == 0 ? 'Home' : routePath.join(' / ')}</title>
      </Head>

      <AppShell
        layout="alt"
        header={{ height: 80 }}
        footer={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !openedSidebar },
        }}
        padding="md"
      >
        <AppShell.Header>
          <HeaderLayout />
        </AppShell.Header>
        <AppShell.Navbar>
          <AppShell.Section>
            <div className="flex flex-row items-center justify-center px-5 py-5">
              <Burger opened={openedSidebar} onClick={toggleSidebar} size="sm" className="lg:hidden" />
              <LogoComponent />
            </div>
          </AppShell.Section>
          <AppShell.Section grow component={ScrollArea}>
            {menus.map((item, index) => {
              const mappingChildrenMenu =
                item.child?.map((subMenu, indexSubmenu) => ({
                  id: indexSubmenu,
                  name: subMenu.name,
                  path: subMenu.path,
                })) ?? [];
              return (
                <NavbarMenuItem
                  key={item.code}
                  id={index}
                  childrenMenu={mappingChildrenMenu}
                  name={item.name}
                  path={item.path}
                />
              );
            })}
          </AppShell.Section>
          <AppShell.Section>
            <Button
              variant="light"
              color="blue"
              size="lg"
              leftSection={<IconChevronLeft size={16} color="grey" />}
              fullWidth
              onClick={back}
            >
              Kembali
            </Button>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main
          style={{
            backgroundColor: '#F8F9FB',
          }}
        >
          <Stack
            gap={'md'}
            p={{
              xs: 0,
              lg: 'md',
            }}
          >
            <Box>
              <Stack gap={'xs'}>
                <div className="font-medium text-3xl">{title || 'Default Title'}</div>
                <div className="flex flex-row flex-wrap">
                  {generateBreadcrumbs({ path: pathname, override: breadcrumbsOverride?.(query) })}
                </div>
              </Stack>
            </Box>
            {children}
          </Stack>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
