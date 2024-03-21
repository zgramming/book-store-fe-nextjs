import { AuthenticationRepository } from '@/features/authentication/authentication.repository';
import { AuthenticationAccessMenu } from '@/features/authentication/entities/authentication-access.entity';
import { KEY_LOCALSTORAGE_ACCESS_GROUP } from '@/utils/constant';
import { createContext, useEffect, useState } from 'react';

type ContextProps = {
  flattedMenu: AuthenticationAccessMenu[];
};

export const AccessGroupContext = createContext<ContextProps>({
  flattedMenu: [],
});

function AccessGroupProvider({ children }: any) {
  const { data: dataAccess, isLoading, error } = AuthenticationRepository.hooks.useGetAccess();
  const [flattedMenu, setFlattedMenu] = useState<AuthenticationAccessMenu[]>([]);

  useEffect(() => {
    if (!dataAccess) return;

    const saveToLocalStorage = () => {
      const mappingOnlyMenu = dataAccess
        .map((category) => {
          const menus = category.moduls.map((modul) => modul.menus);
          return menus;
        })
        .flat()
        .flat();

      // Save to localstorage
      const encodeMenus = JSON.stringify(mappingOnlyMenu);
      localStorage.setItem(KEY_LOCALSTORAGE_ACCESS_GROUP, encodeMenus);

      setFlattedMenu(mappingOnlyMenu);
    };

    saveToLocalStorage();

    return () => {};
  }, [dataAccess]);

  if (isLoading) return;
  if (error) return;

  return (
    <AccessGroupContext.Provider
      value={{
        flattedMenu,
      }}
    >
      {children}
    </AccessGroupContext.Provider>
  );
}

export default AccessGroupProvider;
