import { Delimiter } from './delimiter.enum';

/**
 * Validation error description.
 * @see https://github.com/typestack/class-validator
 *
 * @publicApi
 */
export interface ValidationError {
  /**
   * Object that was validated.
   */
  target?: Record<string, any>; // tslint:disable-line:no-any
  /**
   * Object's property that hasn't passed validation.
   */
  property: string;
  /**
   * Value that hasn't passed validation.
   */
  value?: any; // tslint:disable-line:no-any
  /**
   * Constraints that failed validation with error messages.
   */
  constraints?: {
    [type: string]: string;
  };
  /**
   * Contains all nested validation errors of the property.
   */
  children?: ValidationError[];
}

export interface ValidationErrorOptions {
  /**
   * Custom template, tokens:
   * {propertyPath} - Full dotted property path (e.g user.email)
   * {property} - Last piece of {propertyPath} (e.g. email)
   * {constraintRule} - Constraint rule id (e.g. isEmail)
   * {constraintMessage} - Constraint message (e.g. must be an email)
   */
  template?: string;
  /**
   * Delimiter of joined several validation messages.
   * Default: Comma and space (CS)
   */
  delimiter?: Delimiter | string;
  /**
   * Period at the end of string.
   * Default: false
   */
  period?: boolean;
}
