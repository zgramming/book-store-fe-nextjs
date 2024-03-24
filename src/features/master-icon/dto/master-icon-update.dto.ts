import { MasterIconCreateDTO } from './master-icon-create.dto';

export interface MasterIconUpdateDTO extends Partial<MasterIconCreateDTO> {
  updated_by: number;
}
