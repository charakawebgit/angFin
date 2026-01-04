import { FieldConfig } from '@entities/calculator/model/types';
import { required, min, max } from '@angular/forms/signals';

// The Angular signal-forms library uses complex internal Schema types that are
// difficult to express for a dynamic schema builder. We centralize the
// `any` usage here and keep a small, well-tested mapper that applies
// validators based on `FieldConfig`.
export function buildFormSchema(fields: FieldConfig[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (schema: any) => {
    fields.forEach((f: FieldConfig) => {
      const field = schema[f.key];
      if (!field) return;
      if (f.required) required(field);
      if (f.min !== undefined) min(field, f.min);
      if (f.max !== undefined) max(field, f.max);
    });
  };
}
