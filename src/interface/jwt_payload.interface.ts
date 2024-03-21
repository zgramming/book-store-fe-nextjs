export interface IJWTPayload {
  userId: string;
  username: string;
  kodeGroup: string;
  sub: number;
  iat: number;
  exp: number;
}
