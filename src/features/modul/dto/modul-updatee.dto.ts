import { ModulCreateDTO } from './modul-create.dto';

export interface ModulUpdateDTO extends Partial<ModulCreateDTO> {
  updated_by: number;
}
