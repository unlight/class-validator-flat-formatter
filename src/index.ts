import { Delimiter } from './delimiter.enum.js';
import { ErrorElement, ValidationError, ValidationErrorOptions } from './types';
import { PlainObject } from 'simplytyped';

const defaultTemplate =
  '{propertyPath}: {constraintMessage} ({constraintRule})';

/**
 * Slightly refactored ValidationError.toString()
 * https://github.com/typestack/class-validator/blob/master/src/validation/ValidationError.ts
 */
export function validationError(
  errors: ValidationError[] | ValidationError,
  options?: ValidationErrorOptions,
) {
  const delimiter = options?.delimiter ?? Delimiter.CS;
  const period = options?.period ?? false;
  const template = options?.template ?? defaultTemplate;

  errors = Array.isArray(errors) ? errors : [errors];

  let result = '';

  if (errors.length > 0) {
    const errorElements = errors.flatMap(err => getErrorElements(err, ''));
    const errorStrings = errorElements.map(error =>
      templateString(template, error),
    );
    result += errorStrings.join(delimiter);
    if (result && period) {
      result += '.';
    }
  }

  return result;
}

export function validationErrorsAsArray(
  errors: ValidationError[] | ValidationError,
  template: string = defaultTemplate,
): string[] {
  errors = Array.isArray(errors) ? errors : [errors];
  const errorElements = errors.flatMap(error => getErrorElements(error, ''));
  const result = errorElements.map(error => templateString(template, error));

  return result;
}

export function validationErrorsByProperty(
  errors: ValidationError[] | ValidationError,
  template: string = '{constraintMessage} ({constraintRule})',
  delimiter: string = '\n',
) {
  errors = Array.isArray(errors) ? errors : [errors];
  const errorElements = errors.flatMap(error => getErrorElements(error, ''));
  const groups = Object.groupBy(errorElements, error => error.propertyPath);
  const propertyErrors = Object.entries(groups).map(
    ([propertyPath, errors]) => {
      const messages = errors
        ?.flatMap(error => templateString(template, error))
        .join(', ');

      return `${propertyPath}: ${messages}`;
    },
  );

  return propertyErrors.join(delimiter);
}

function getErrorElements(
  error: ValidationError,
  parentPath: string,
): ErrorElement[] {
  if (!isValidationError(error)) {
    return [];
  }

  const propertyPath = getPropertyPath(parentPath, error.property);
  const constraints = Object.entries(error.constraints || []);

  const result: ErrorElement[] = constraints.map(
    ([constraintRule, constraintMessage]) => {
      const [property] = propertyPath.split('.').slice(-1);
      const stripPart = `${property} `;

      if (constraintMessage.startsWith(stripPart)) {
        constraintMessage = constraintMessage.slice(stripPart.length);
      }

      return {
        property: property || '',
        propertyPath,
        constraintMessage,
        constraintRule,
      };
    },
  );

  if (error.children && error.children.length > 0) {
    const childErrors = error.children.flatMap(err =>
      getErrorElements(err, propertyPath),
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
