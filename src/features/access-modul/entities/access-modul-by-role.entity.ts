export interface AccessModulByRoleEntity {
  error: boolean;
  message: string;
  dataExist: AccessModulByRoleExisting[];
  dataNotExist: AccessModulByRoleNotExisting[];
}

export interface AccessModulByRoleExisting {
  id: number;
  app_category_modul_id: number;
  icon_id: any;
  code: string;
  name: string;
  order: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: any;
  updated_by: any;
  app_category_modul: AppCategoryModulExisting;
}

export interface AppCategoryModulExisting {
  id: number;
  icon_id: any;
  code: string;
  name: string;
  order: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: any;
  updated_by: any;
}

interface AccessModulByRoleNotExisting {
  id: number;
  app_category_modul_id: number;
  icon_id: any;
  code: string;
  name: string;
  order: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: any;
  updated_by: any;
  app_category_modul: AppCategoryModulNotExisting;
}

interface AppCategoryModulNotExisting {
  id: number;
  icon_id: any;
  code: string;
  name: string;
  order: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: any;
  updated_by: any;
}
