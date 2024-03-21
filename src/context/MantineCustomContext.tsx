import { useEffect } from 'react';

import { MantineColorsTuple, createTheme, MantineProvider } from '@mantine/core';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { ModalsProvider } from '@mantine/modals';
import { breakpoint } from '@/utils/constant';
import { useRouter } from 'next/router';
import { Notifications } from '@mantine/notifications';

function RouteTransition() {
  const { asPath, events } = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => url !== asPath && nprogress.start();
    const handleComplete = () => nprogress.complete();
    events.on('routeChangeStart', handleStart);
    events.on('routeChangeComplete', handleComplete);
    events.on('routeChangeError', handleComplete);
    return () => {
      events.off('routeChangeStart', handleStart);
      events.off('routeChangeComplete', handleComplete);
      events.off('routeChangeError', handleComplete);
    };
  }, [asPath, events]);

  return <NavigationProgress />;
}

const myColor: MantineColorsTuple = [
  '#dcffee',
  '#afffd3',
  '#7effb9',
  '#4dff9e',
  '#21ff83',
  '#0de66a',
  '#00b351',
  '#008039',
  '#004d21',
  '#001c07',
];

const theme = createTheme({
  fontFamily: 'Poppins, sans-serif',
  headings: {
    fontFamily: 'Poppins, sans-serif',
  },
  black: '#404040',
  primaryColor: 'myColor',
  breakpoints: {
    xs: breakpoint.xs,
    sm: breakpoint.sm,
    md: breakpoint.md,
    lg: breakpoint.lg,
    xl: breakpoint.xl,
  },
  colors: {
    myColor,
  },
});

function MantineCustomProvider({ children }: any) {
  return (
    <MantineProvider defaultColorScheme={'light'} theme={theme}>
      <ModalsProvider>
        <Notifications 
        position="top-right"
        />
        <RouteTransition />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}

export default MantineCustomProvider;
