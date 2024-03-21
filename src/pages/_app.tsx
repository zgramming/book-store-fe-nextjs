import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/nprogress/styles.css';

import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

import type { AppProps } from 'next/app';
import MantineCustomProvider from '@/context/MantineCustomContext';
import SidebarLayoutProvider from '@/context/SidebarLayoutContext';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <MantineCustomProvider>
        <SidebarLayoutProvider>{getLayout(<Component {...pageProps} />)}</SidebarLayoutProvider>
      </MantineCustomProvider>
    </>
  );
}
