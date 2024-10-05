# class-validator-flat-formatter

Convert array of ValidationError objects from class-validator to multiline string

## Install

```sh
npm install class-validator-flat-formatter
```

## Usage

#### As string

```ts
import { validationError } from 'class-validator-flat-formatter';

const errors = await validate(user);

const message = validationError(errors, options);
// message => name: should not be empty (isNotEmpty), email: must be an email (isEmail)
```

##### Options

```ts
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
```

#### As array

```ts
import { validationErrorsAsArray } from 'class-validator-flat-formatter';

const errors = await validate(user);
const messages = validationErrorsAsArray(errors);
/** 
messages => Array<string> {
    'name: should not be empty (isNotEmpty)',
    'email: must be an email (isEmail)'
}
*/
```

## License

[MIT License](https://opensource.org/licenses/MIT) (c) 2024

# todo oringal errors
