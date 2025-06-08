import { Delimiter } from './delimiter.enum';

export interface ErrorElement {
  property: string;
  propertyPath: string;
  constraintMessage: string;
  constraintRule: string;
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target?: Record<string, any>;
  /**
   * Object's property that hasn't passed validation.
   */
  property: string;
  /**
   * Value that hasn't passed validation.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
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
