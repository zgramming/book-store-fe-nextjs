export interface AuthenticationProfileEntity {
  status: number;
  message: string;
  data: Data;
}

interface Data {
  idUser: number;
  username: string;
  kodeGroup: number;
  jenisUser: number;
  idPegawai: number;
  namaUser: string;
  keteranganUser: string;
  email: string;
  hp: string;
  fotoUser: string;
  divisi: string;
  jabatan: string;
  nikUser: any;
  groupName: string
  statusUser: boolean;
}
