import { ParameterCreateDTO } from './parameter-create.dto';

export interface ParameterUpdateDTO extends Partial<ParameterCreateDTO> {
  updated_by: number;
}
