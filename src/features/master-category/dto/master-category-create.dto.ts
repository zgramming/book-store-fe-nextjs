export interface MasterCategoryCreateDTO {
  master_category_parent_id?: string;
  code: string;
  name: string;
  description: string;
  status: string;
  created_by: number;
}
