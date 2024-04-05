import { IAccessGroupOnlyMenu } from '@/interface/access-group-only-menu.interface';

export const dummyModul = [
  {
    id: 1,
    name: 'Modul 1',
    link: '/modul1',
    code: 'MDL1',
    prefix: 'MDL1',
    order: 1,
    status: true,
  },
  {
    id: 2,
    name: 'Modul 2',
    link: '/modul2',
    code: 'MDL2',
    prefix: 'MDL2',
    order: 2,
    status: true,
  },
  {
    id: 3,
    name: 'Modul 3',
    link: '/modul3',
    code: 'MDL3',
    prefix: 'MDL3',
    order: 3,
    status: false,
  },
];

export const dummyMenu: IAccessGroupOnlyMenu = [
  {
    code: 1,
    path: '/master-book',
    name: 'Master Book',
    order: 1,
    access: [],
    child: [],
  },
  {
    code: 2,
    path: '/master-student',
    name: 'Master Student',
    order: 2,
    access: [],
    child: [],
  },
  {
    code: 3,
    path: '/inventory',
    name: 'Inventory',
    order: 3,
    access: [],
    child: [],
  },
  {
    code: 4,
    path: '/transaction',
    name: 'Transaction',
    order: 4,
    access: [],
    child: [],
  },
  {
    code: 5,
    path: '/history',
    name: 'History',
    order: 5,
    access: [],
    child: [],
  },
];
