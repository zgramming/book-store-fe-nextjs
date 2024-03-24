import { CategoryModulCreateDTO } from './category-modul-create.dto';

export interface CategoryModulUpdateDto extends Partial<CategoryModulCreateDTO> {
  updated_by: number;
}
