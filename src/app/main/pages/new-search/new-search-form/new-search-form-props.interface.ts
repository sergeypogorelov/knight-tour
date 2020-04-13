import { NewSearchFormResult } from "./new-search-form-result.interface";

export interface NewSearchFormProps {
  onSubmit(result: NewSearchFormResult): void;
}
