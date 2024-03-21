type SubMenuV2 = {
  id: number;
  code: string;
  name: string;
  order: number;
  path: string;
  subMenuParentCode?: string;
};

export type MenuV2 = {
  id: number;
  code: string;
  name: string;
  order: number;
  path?: string;
  subMenus?: SubMenuV2[];
};

export type ModulV2 = {
  id: number;
  code: string;
  name: string;
  order: number;
  prefix: string;
  menus?: MenuV2[];
};

export type CategoryModul = {
  id: number;
  code: string;
  name: string;
  order: number;
  moduls: ModulV2[];
};
