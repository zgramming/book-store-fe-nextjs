export interface IJWTPayload {
  userId: number;
  username: string;
  roleId: string;
  sub?: number;
  iat?: number;
  exp?: number;
}
