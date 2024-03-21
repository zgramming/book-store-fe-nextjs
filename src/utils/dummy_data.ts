import { CategoryModul } from '@/interface/category_modul';

export type Role = {
  id: number;
  name: string;
  code: string;
  status: boolean;
};

export const dummmyModulAndMenuV2: CategoryModul[] = [
  {
    id: 1,
    code: 'SETTING',
    name: 'Setting',
    order: 99,
    moduls: [
      {
        id: 1,
        code: 'SETTING',
        name: 'Setting',
        prefix: 'setting',
        order: 1,
        menus: [
          // {
          //   id: 1,
          //   code: 'MANAGEMENT_GROUP',
          //   name: 'Management Group',
          //   order: 1,
          //   path: 'setting/group',
          // },
          // {
          //   id: 2,
          //   code: 'MANAGEMENT_USER',
          //   name: 'Management User',
          //   order: 2,
          //   path: 'setting/user',
          // },
          // {
          //   id: 3,
          //   code: 'MANAGEMENT_CATEGORY_MODUL',
          //   name: 'Management Category Modul',
          //   order: 3,
          //   path: 'setting/category_modul',
          // },
          // {
          //   id: 4,
          //   code: 'MANAGEMENT_MODUL',
          //   name: 'Management Modul',
          //   order: 4,
          //   path: 'setting/modul',
          // },
          // {
          //   id: 5,
          //   code: 'MANAGEMENT_MENU',
          //   name: 'Management Menu',
          //   order: 5,
          //   path: 'setting/menu',
          // },
          // {
          //   id: 6,
          //   code: 'ACCESS_MODUL',
          //   name: 'Access Modul',
          //   order: 6,
          //   path: 'setting/access_modul',
          // },
          // {
          //   id: 7,
          //   code: 'ACCESS_MENU',
          //   name: 'Access Menu',
          //   order: 7,
          //   path: 'setting/access_menu',
          // },
          // {
          //   id: 8,
          //   code: 'MASTER_DATA',
          //   name: 'Master Data',
          //   order: 8,
          //   path: 'setting/master_data',
          // },
          // {
          //   id: 9,
          //   code: 'PARAMETER',
          //   name: 'Parameter',
          //   order: 9,
          //   path: 'setting/parameter',
          // },
          // {
          //   id: 10,
          //   code: 'LOG_ACTIVITY',
          //   name: 'Log Activity',
          //   order: 10,
          //   path: 'setting/log_activity',
          // },
          // {
          //   id: 11,
          //   code: 'DEVELOPER',
          //   name: 'Developer',
          //   order: 11,
          //   path: 'setting/developer',
          // },
          // {
          //   id: 13,
          //   code: 'MASTER_ICON',
          //   name: 'Master Icon',
          //   order: 13,
          //   path: 'setting/master_icon',
          // },
          {
            id: 14,
            code: 'DOKUMENTASI',
            name: 'Dokumentasi',
            order: 14,
            path: 'setting/dokumentasi',
          },
          {
            id: 12,
            code: 'EXAMPLE_SUB_MENU',
            name: 'Example Sub Menu',
            order: 12,
            subMenus: [
              {
                id: 13,
                code: 'ENABLE_2FA',
                name: 'Enable 2FA',
                order: 1,
                path: 'setting/parent_menu/enable2fa',
              },
              {
                id: 14,
                code: 'CHANGE_PASSWORD',
                name: 'Change Password',
                order: 2,
                path: 'setting/parent_menu/change_password',
              },
            ],
          },
        ],
      },
    ],
  },
];

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

export const dummyUser = [
  {
    id: 1,
    name: 'Admin',
    username: 'admin',
    role: 'Admin',
    status: true,
  },
];

export const dummyRole: Role[] = [
  {
    id: 1,
    name: 'Admin',
    code: 'ADM',
    status: true,
  },
  {
    id: 2,
    name: 'User',
    code: 'USR',
    status: false,
  },
  {
    id: 3,
    name: 'Super Admin',
    code: 'SADM',
    status: true,
  },
];
