export interface RoleForAppModulEntity {
  status: number;
  message: string;
  data: Data;
}

interface Data {
  dataExist: DataExist[];
  dataNotExist: DataNotExist[];
}

interface DataExist {
  kodeModul: number;
  kategoriModul: number;
  namaModul: string;
  folderModul: string;
  iconModul: string;
  urutanModul: number;
  statusModul: boolean;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  deletedBy: any;
  deletedTime: any;
  category: Category;
}

interface Category {
  kodeKategori: number;
  namaKategori: string;
  urutanKategori: number;
  statusGroup: boolean;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  deletedBy: string;
  deletedTime: any;
}

interface DataNotExist {
  kodeModul: number;
  kategoriModul: number;
  namaModul: string;
  folderModul: string;
  iconModul: string;
  urutanModul: number;
  statusModul: boolean;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  deletedBy: any;
  deletedTime: any;
  category: Category2;
}

interface Category2 {
  kodeKategori: number;
  namaKategori: string;
  urutanKategori: number;
  statusGroup: boolean;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  deletedBy: string;
  deletedTime: any;
}
