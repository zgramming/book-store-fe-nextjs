import { IAccessGroupOnlyMenu } from '@/interface/access-group-only-menu.interface';
import { KEY_LOCALSTORAGE_ACCESS_GROUP } from '@/utils/constant';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';

const useCheckAccessGroup = () => {
  const { pathname } = useRouter();
  const [value] = useLocalStorage<IAccessGroupOnlyMenu | undefined>({
    key: KEY_LOCALSTORAGE_ACCESS_GROUP,
    defaultValue: undefined,
  });

  const splitPath = pathname.split('/').filter((item) => item !== '');
  const [firstPath, secondPath, thirdPath, fourPath] = splitPath;

  // Find menu where pathname is equal to link
  // [isMatch] is used to check if the current path is equal to the link
  // If not, it will check the path without the last path
  const findMenu = value?.find((item) => {
    if (fourPath) {
      const isMatch = item.path == `${firstPath}/${secondPath}/${thirdPath}/${fourPath}`;

      if (!isMatch) {
        return item.path == `${firstPath}/${secondPath}/${thirdPath}`;
      }

      return isMatch;
    }

    if (thirdPath) {
      const isMatch = item.path == `${firstPath}/${secondPath}/${thirdPath}`;

      if (!isMatch) {
        return item.path == `${firstPath}/${secondPath}`;
      }

      return isMatch;
    }

    if (secondPath) {
      return item.path == `${firstPath}/${secondPath}`;
    }

    return item.path == `${firstPath}`;
  });

  if (!findMenu) {
    return {
      isCanView: false,
      isCanEdit: false,
      isCanCreate: false,
      isCanDelete: false,
      isCanApprove: false,
      isCanPrint: false,
      isCanExport: false,
      isCanImport: false,
    };
  }

  return {
    isCanView: findMenu.access.includes('view'),
    isCanEdit: findMenu.access.includes('edit'),
    isCanCreate: findMenu.access.includes('add'),
    isCanDelete: findMenu.access.includes('delete'),
    isCanApprove: findMenu.access.includes('approve'),
    isCanPrint: findMenu.access.includes('print'),
    isCanExport: findMenu.access.includes('export'),
    isCanImport: findMenu.access.includes('import'),
  };
};

export default useCheckAccessGroup;
