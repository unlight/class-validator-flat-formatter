# class-validator-flat-formatter

Convert array of ValidationError objects from class-validator to multiline string

## Usage

```ts
import { classValidatorFlatFormatter } from 'class-validator-flat-formatter';

const message = classValidatorFlatFormatter(errors as ValidationError[]);
// message =>
name: minLength error message (minLength),
name: name should not be empty (isNotEmpty).
```
