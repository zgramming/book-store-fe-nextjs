export interface AccessMenuByRoleAndCategoryModulEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  accessible_modul: AccessibleModul[];
  selected_access_menu: SelectedMenu[];
}

export interface AccessibleModul {
  id: number;
  app_category_modul_id: number;
  name: string;
  code: string;
  menus: Menu[];
}

interface Menu {
  id: number;
  app_menu_id_parent?: number;
  app_category_modul_id: number;
  app_modul_id: number;
  code: string;
  name: string;
  order: number;
  menu_childrens: MenuChildren[];
}

interface MenuChildren {
  id: number;
  app_menu_id_parent: number;
  app_category_modul_id: number;
  app_modul_id: number;
  code: string;
  name: string;
  order: number;
}

interface SelectedMenu {
  id: string;
  role_id: number;
  app_category_modul_id: number;
  app_modul_id: number;
  app_menu_id: number;
  permissions: string[];
}
