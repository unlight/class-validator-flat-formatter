import { Delimiter } from './delimiter.enum';
import { ValidationError, ValidationErrorOptions } from './types';
import { PlainObject } from 'simplytyped';

const defaultTemplate =
  '{propertyPath}: {constraintMessage} ({constraintRule})';

/**
 * Slightly refactored ValidationError.toString()
 * https://github.com/typestack/class-validator/blob/master/src/validation/ValidationError.ts
 */
export function validationError(
  errors: ValidationError[] | ValidationError,
  options: ValidationErrorOptions = {},
) {
  const delimiter = options?.delimiter ?? Delimiter.CS;
  const period = options?.period ?? false;
  const template = options?.template ?? defaultTemplate;

  errors = Array.isArray(errors) ? errors : [errors];

  let result = '';

  if (errors.length > 0) {
    result = errors
      .flatMap(err => formatError(err, '', template))
      .join(delimiter);
    if (result && period) {
      result += '.';
    }
  }

  return result;
}

export function validationErrorsAsArray(
  errors: ValidationError[] | ValidationError,
) {
  errors = Array.isArray(errors) ? errors : [errors];
  const result: string[] = errors.flatMap(err =>
    formatError(err, '', defaultTemplate),
  );

  return result;
}

function formatError(
  error: ValidationError,
  parentPath: string,
  template: string,
): string[] {
  if (!isValidationError(error)) {
    return [];
  }

  const propertyPath = getPropertyPath(parentPath, error.property);
  const constraints = Object.entries(error.constraints || []);

  const result = constraints.map(([constraintRule, constraintMessage]) => {
    const [property] = propertyPath.split('.').slice(-1);
    const stripPart = `${property} `;

    if (constraintMessage.startsWith(stripPart)) {
      constraintMessage = constraintMessage.slice(stripPart.length);
    }

    return templateString(template, {
      property,
      propertyPath,
      constraintMessage,
      constraintRule,
    });
  });

  if (error.children && error.children.length > 0) {
    const childErrors = error.children.flatMap(err =>
      formatError(err, propertyPath, template),
    );
    result.push(...childErrors);
  }

  return result;
}

function getPropertyPath(parent: string, name: string) {
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

function templateString(string: string, variables?: PlainObject) {
  if (!variables) {
    // Nothing to do if no variables object was provided
    return string;
  }

  return string.replace(/\{([^}]+)}/g, (all, name: string): string => {
    if (name in variables) return String(variables[name]);

    return all;
  });
}
