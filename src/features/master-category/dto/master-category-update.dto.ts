import { MasterCategoryCreateDTO } from './master-category-create.dto';

export interface MasterCategoryUpdateDTO extends Partial<MasterCategoryCreateDTO> {
  updated_by?: number;
}
