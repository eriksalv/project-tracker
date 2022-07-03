import { SchemaOf, ValidationError } from "yup";

export default async function validate<T = Record<string, any>>(
  schema: SchemaOf<T>,
  data: Record<string, any> | null
) {
  try {
    const validData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      strict: true,
    });
    return { isValid: true, errors: null, data: validData };
  } catch (error) {
    let errors;
    if (error instanceof ValidationError) {
      errors = error.errors;
    } else {
      errors = JSON.stringify(error);
    }
    return { isValid: false, errors };
  }
}
