import { MasterDataCreateDTO } from './master-data-create.dto';

export interface MasterDataUpdateDTO extends Partial<MasterDataCreateDTO> {
  updated_by?: number;
}
