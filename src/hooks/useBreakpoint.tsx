import { breakpoint } from '@/utils/constant';
import { useMediaQuery } from '@mantine/hooks';

const useBreakpoint = () => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint.sm})`);
  const isTablet = useMediaQuery(`(max-width: ${breakpoint.md})`);
  const isDesktop = useMediaQuery(`(max-width: ${breakpoint.lg})`);
  const isLargeDesktop = useMediaQuery(`(max-width: ${breakpoint.xl})`);
  const isXLargeDesktop = useMediaQuery(`(max-width: ${breakpoint['2xl']})`);

  return { isMobile, isTablet, isDesktop, isLargeDesktop, isXLargeDesktop };
};

export default useBreakpoint;
