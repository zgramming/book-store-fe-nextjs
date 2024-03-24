import { Card, LoadingOverlay, Stack } from '@mantine/core';
import Head from 'next/head';
import Image from 'next/image';

import SubModulIcon from '@/images/icon_sub_modul.png';
import ModulIcon from '@/images/icon_modul.png';
import useBreakpoint from '@/hooks/useBreakpoint';
import HeaderLayoutIndex from '@/components/layout/HeaderLayoutIndex';
import Link from 'next/link';
import { AuthenticationRepository } from '@/features/authentication/authentication.repository';

type ContentIndexItemProps = {
  index: number;
  name: string;
  icon_url?: string;
  path?: string;
};
const ContentIndexItem = ({ index, name, path }: ContentIndexItemProps) => {
  const { isMobile } = useBreakpoint();

  return (
    <div key={index} className="col-span-1">
      <Link
        href={`${path}`}
        style={{
          pointerEvents: !path ? 'none' : 'auto',
          // Remove underline on hover
          textDecoration: 'none',
        }}
      >
        <Card h={150} shadow="xs" withBorder className="cursor-pointer hover:bg-green-100">
          <Stack align="center" gap={'xs'} justify="center" className="h-full">
            <Image src={ModulIcon} alt="Divider Modul" width={isMobile ? 50 : 80} height={isMobile ? 50 : 80} />
            <div className="font-bold text-sm text-center lg:text-base">{name}</div>
          </Stack>
        </Card>
      </Link>
    </div>
  );
};

const ContentIndex = () => {
  const { isLoading: isLoadingAccess, data: dataAccess } = AuthenticationRepository.hooks.useGetAccess();
  const items = dataAccess ?? [];
  return (
    <>
      {/* {dummmyModulAndMenuV2.map((category) => {
        const moduls = category.moduls;
        return (
          <div key={category.code} className={`px-5 lg:px-20`}>
            <Stack gap={'md'}>
              <div className="flex flex-row items-center justify-start gap-2">
                <div className="font-bold text-primary text-base lg:text-xl">{category.name}</div>
                <Image src={SubModulIcon} alt="Divider Modul" width={30} />
                <div className="grow h-[1px] bg-gray-300"></div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 lg:gap-10">
                {moduls.map((modul, index) => {
                  const firstMenu = modul?.menus ?? [];
                  const path = firstMenu.length > 0 ? firstMenu[0].path : '/';
                  return <ContentIndexItem key={index} index={index} name={modul.name} path={path} />;
                })}
              </div>
            </Stack>
          </div>
        );
      })} */}
      <LoadingOverlay visible={isLoadingAccess} />
      {items.map((categoryModul) => {
        const moduls = categoryModul.moduls;
        return (
          <div key={categoryModul.code} className={`px-5 lg:px-20`}>
            <Stack gap={'md'}>
              <div className="flex flex-row items-center justify-start gap-2">
                <div className="font-bold text-primary text-base lg:text-xl">{categoryModul.name}</div>
                <Image src={SubModulIcon} alt="Divider Modul" width={30} />
                <div className="grow h-[1px] bg-gray-300"></div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 lg:gap-10">
                {moduls.map((modul, index) => {
                  const { name } = modul;
                  const menus = modul.menus || [];
                  const path = menus.length > 0 ? menus[0].path : '/';
                  return <ContentIndexItem key={index} index={index} name={name} path={path} icon_url={modul.icon} />;
                })}
              </div>
            </Stack>
          </div>
        );
      })}
    </>
  );
};

export default function Page() {
  return (
    <>
      <Head>
        <title>CMS Template - Home</title>
        <meta
          name="description"
          content="CMS Template merupakan aplikasi berbasis web yang digunakan untuk mengelola konten website. Aplikasi ini memiliki fitur yang memudahkan pengguna dalam mengelola konten website seperti menambah, mengedit, menghapus konten website."
        />
        <meta property="og:title" content="CMS Tempalte" />
        <meta property="og:type" content="CMS Tempalte" />
        <meta property="og:image:url" content="https://picsum.photos/400" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:alt" content="CMS Tempalte Image" />
        <meta
          property="og:description"
          content="CMS Template merupakan aplikasi berbasis web yang digunakan untuk mengelola konten website. Aplikasi ini memiliki fitur yang memudahkan pengguna dalam mengelola konten website seperti menambah, mengedit, menghapus konten website."
        />
      </Head>
      <div className="min-h-screen">
        <Stack gap={'lg'}>
          <HeaderLayoutIndex useShadow />
          <ContentIndex />
          <div className="pb-32" />
        </Stack>
      </div>
    </>
  );
}
