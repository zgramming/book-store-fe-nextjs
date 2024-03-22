export interface MenuCreateDTO {
  app_menu_id_parent?: number;
  icon_id?: number;
  app_modul_id: number;
  code: string;
  name: string;
  route: string;
  order: number;
  status: string;
  created_by: number;
}
