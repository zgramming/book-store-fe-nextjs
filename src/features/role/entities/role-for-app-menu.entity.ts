export interface RoleForAppMenuEntity {
  status: number;
  message: string;
  data: Data;
}

interface Data {
  accessMenu: AccessMenu[];
  listAllMenu: ListAllMenu[];
}

interface AccessMenu {
  kodeMenu: number;
  statusGroup: string;
}

interface ListAllMenu {
  code: number;
  name: string;
  prefix: string;
  order: number;
  menus: Menu[];
}

interface Menu {
  code: number;
  name: string;
  order: number;
  path: string;
}
