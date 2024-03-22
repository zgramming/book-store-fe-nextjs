import { TemplateDokumenCreateDTO } from './template-dokumen-create.dto';

export interface TemplateDokumenUpdateDTO extends Partial<TemplateDokumenCreateDTO> {
  updated_by: number;
}
