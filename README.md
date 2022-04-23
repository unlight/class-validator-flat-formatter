# class-validator-flat-formatter

Convert array of ValidationError objects from class-validator to multiline string

## Install

```sh
npm install class-validator-flat-formatter
```

## Usage

#### As string

```ts
import { validationErrorsAsString } from 'class-validator-flat-formatter';

const errors = await validate(user);

const message = validationErrorsAsString(errors);
/** 
message(String) =>
name: minLength error message (minLength),\n
email: email must be an email (isEmail).
*/
```

#### As array

```ts
import { validationErrorsAsArray } from 'class-validator-flat-formatter';

const errors = await validate(user);
const messages = validationErrorsAsArray(errors);
/** 
messages => Array<string> {
    'name: minLength error message (minLength)',
    'email: email must be an email (isEmail)'
}
*/
```
