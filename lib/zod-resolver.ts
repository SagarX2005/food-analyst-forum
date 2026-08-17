import type { FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

/**
 * Lightweight, zero-dependency Zod resolver for React Hook Form.
 */
export function zodResolver<T extends FieldValues>(schema: z.ZodType<T>): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors: Record<string, { type: string; message: string }> = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path.join(".");
      if (fieldName && !errors[fieldName]) {
        errors[fieldName] = {
          type: issue.code,
          message: issue.message,
        };
      }
    });

    return {
      values: {} as T,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors: errors as any,
    };
  };
}
