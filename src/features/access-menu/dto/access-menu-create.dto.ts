export interface AccessMenuCreateDTO {
  role_id: number;
  app_menu_id: number;
  permissions: string[];
  created_by: number;
}
