import { MenuCreateDTO } from './menu-create.dto';

export interface MenuUpdateDTO extends Partial<MenuCreateDTO> {
  updated_by: number;
}
