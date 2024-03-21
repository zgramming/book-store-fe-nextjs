export type IAccessGroupOnlyMenu = Root2[];

interface Root2 {
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
