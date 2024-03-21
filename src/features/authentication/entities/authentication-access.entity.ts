export interface AuthenticationAccessEntity {
  status: number;
  message: string;
  data: Daum[];
}

interface Daum {
  code: number;
  name: string;
  order: number;
  moduls: Modul[];
}

interface Modul {
  code: number;
  name: string;
  order: number;
  icon?: string;
  menus: AuthenticationAccessMenu[];
}

export interface AuthenticationAccessMenu {
  code: number;
  name: string;
  path: string;
  order: number;
  access: string[];
  child: Child[];
}

interface Child {
  code: number;
  name: string;
  path: string;
  order: number;
  access: string[];
}
