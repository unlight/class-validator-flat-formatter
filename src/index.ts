import { Delimiter } from './delimiter.enum';
import { ValidationError, ValidationErrorOptions } from './types';

export function validationError(
  errors: ValidationError[] | ValidationError,
  options: ValidationErrorOptions = {},
) {
  const delimiter = options?.delimiter ?? Delimiter.CS;
  const period = options?.period ?? false;

  errors = Array.isArray(errors) ? errors : [errors];

  let result = '';

  if (errors.length > 0) {
    result = errors.flatMap(err => formatError(err, '')).join(delimiter);
    if (result && period) {
      result += '.';
    }
  }

  return result;
}

/**
 * Slightly refactored ValidationError.toString()
 * https://github.com/typestack/class-validator/blob/master/src/validation/ValidationError.ts
 * @deprecated Use validationError instead
 */
export function validationErrorsAsString(
  errors: ValidationError[] | ValidationError,
): string {
  return validationError(errors, { delimiter: Delimiter.CNL, period: true });
}

export function validationErrorsAsArray(
  errors: ValidationError[] | ValidationError,
) {
  errors = Array.isArray(errors) ? errors : [errors];
  const result: string[] = errors.flatMap(err => formatError(err, ''));

  return result;
}

function formatError(error: ValidationError, parentPath: string): string[] {
  if (!isValidationError(error)) {
    return [];
  }

  const property = propertyPath(parentPath, error.property);
  const constraints = Object.entries(error.constraints || []);

  const result = constraints.map(([constraintName, constraintMessage]) => {
    const [lastPiece] = property.split('.').slice(-1);
    const stripPart = `${lastPiece} `;
    if (constraintMessage.startsWith(stripPart)) {
      constraintMessage = constraintMessage.slice(stripPart.length);
    }
    return `${property}: ${constraintMessage} (${constraintName})`;
  });

  if (error.children && error.children.length > 0) {
    const childErrors = error.children.flatMap(err =>
      formatError(err, property),
    );
    result.push(...childErrors);
  }

  return result;
}

function propertyPath(parent: string, name: string) {
  let result = name;
  if (parent) {
    result = `${parent}.${name}`;
  }
  return result;
}

export function isValidationError(
  error?: Partial<ValidationError>,
): error is ValidationError {
  return Boolean(error?.property && (error.constraints || error.children));
}
