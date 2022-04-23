import { ValidationError } from './validation-error';

/**
 * Slightly refactored ValidationError.toString()
 * https://github.com/typestack/class-validator/blob/master/src/validation/ValidationError.ts
 */
export function validationErrorsAsString(
    errors: ValidationError[] | ValidationError,
    parentPath = '',
): string {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }
    let result = '';
    if (errors.length > 0) {
        result = errors.flatMap(err => formatError(err, parentPath)).join(',\n');
        if (result) {
            result += '.';
        }
    }
    return result;
}

export function validationErrorsAsArray(
    errors: ValidationError[] | ValidationError,
    parentPath = '',
) {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }
    const result: string[] = errors.flatMap(err => formatError(err, parentPath));

    return result;
}

function formatError(error: ValidationError, parentPath: string): string[] {
    if (!isValidationError(error)) {
        return [];
    }

    const constraints = Object.entries(error.constraints || []);

    const result = constraints.flatMap(([constraintName, constraintMessage]) => {
        const property = propertyPath(parentPath, error.property);
        const errors = [`${property}: ${constraintMessage} (${constraintName})`];
        if (error.children?.length) {
            const childErrors = error.children.flatMap(err =>
                formatError(err, property),
            );
            errors.push(...childErrors);
        }
        return errors;
    });

    if (constraints.length === 0 && error.children) {
        const childErrors = error.children.flatMap(err =>
            formatError(err, error.property),
        );
        result.push(...childErrors);
    }

    return result;
}

function propertyPath(parent: string, name: string) {
    if (Number.isInteger(+name)) {
        name = `[${name}]`;
    }
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
