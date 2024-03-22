export interface UserCreateDTO {
  role_id: number;
  name: string;
  username: string;
  password: string;
  status: string;
  phone?: string;
  created_by: number;
}
