export interface MasterDataCreateDTO {
  master_data_parent_id?: number;
  master_category_id: number;
  code: string;
  name: string;
  description: string;
  status: string;

  parameter1_key?: string;
  parameter1_value?: string;
  parameter2_key?: string;
  parameter2_value?: string;
  parameter3_key?: string;
  parameter3_value?: string;

  created_by: number;
}
