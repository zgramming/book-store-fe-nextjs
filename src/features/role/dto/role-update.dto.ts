import { RoleCreateDTO } from './role-create.dto';

export interface RoleUpdateDTO extends Partial<RoleCreateDTO> {
  updated_by: number;
}
