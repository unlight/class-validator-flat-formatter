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
name: should not be empty (isNotEmpty),\n
email: must be an email (isEmail).
*/
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

[MIT License](https://opensource.org/licenses/MIT) (c) 2023
