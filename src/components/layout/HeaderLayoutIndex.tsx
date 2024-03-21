import Logo from '@/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import AccountAvatar from '../AccountAvatar';
import useBreakpoint from '@/hooks/useBreakpoint';

type HeaderLayoutIndexProps = {
  useShadow?: boolean;
  currentModule?: string;
};
const HeaderLayoutIndex = ({ useShadow = false, currentModule }: HeaderLayoutIndexProps) => {
  const { isMobile } = useBreakpoint();

  return (
    <div
      id="header-index"
      className={`
      h-full relative flex flex-row justify-between ${useShadow && 'shadow'}
      px-5 py-3
      lg:px-20 lg:py-3
      `}
    >
      <div className="basis-0 grow ">
        <Link href="/" className="w-min h-full">
          <div className="flex items-center ">
            <Image
              src={Logo}
              alt="Logo"
              width={isMobile ? 150 : 250}
              height={isMobile ? 50 : 100}
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
        </Link>
      </div>
      {currentModule && (
        <div
          className={`basis-0 grow flex flex-col items-center ${
            currentModule ? 'justify-end' : 'justify-center'
          } gap-3`}
        >
          <div className="text-base font-medium"></div>
          {currentModule && (
            <div className="bg-current-module-secondary text-current-module font-bold py-1 px-5">{currentModule}</div>
          )}
        </div>
      )}
      <div className="basis-0 grow flex flex-col justify-center items-end">
        <AccountAvatar />
      </div>
    </div>
  );
};

export default HeaderLayoutIndex;
