export interface AccessMenuCreateDTO {
  role_id: number;
  app_category_modul_id: number;
  app_modul_id: number;
  app_menu_id: number;
  permissions: string[];
  created_by: number;
}
