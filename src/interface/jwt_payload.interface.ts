export interface IJWTPayload {
  userId: string;
  username: string;
  roleId: string;
  sub?: number;
  iat?: number;
  exp?: number;
}
