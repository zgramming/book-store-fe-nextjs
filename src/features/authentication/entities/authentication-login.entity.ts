export interface AuthenticationLoginEntity {
  status: number;
  message: string;
  data: Data;
}

interface Data {
  token?: string;
  tokenAGA?: string;
}
