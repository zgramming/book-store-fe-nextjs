import { UserCreateDTO } from "./user-create.dto";

export interface UserUpdateDTO extends Partial<UserCreateDTO> {
  updated_by: number;
}
