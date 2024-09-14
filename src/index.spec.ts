import {
  IsEmail,
  IsNotEmpty,
  Length,
  Min,
  MinLength,
  validate,
  ValidateNested,
} from 'class-validator';
import { stripIndents } from 'common-tags';
import expect from 'expect';

import {
  validationError,
  validationErrorsAsArray,
  validationErrorsAsString,
} from '.';
import { ValidationError } from './types';

it('built in to string', async () => {
  class User {
    @Length(3, 30) name!: string;
    @IsNotEmpty() @Min(18) age!: number;
  }
  const user = new User();
  const errors = await validate(user);
  expect(errors).toBeTruthy();
});

it('no errors should return empty', () => {
  const message = validationErrorsAsString([]);
  expect(message).toEqual('');
});

it('single error object', async () => {
  class User {
    @IsEmail() email = '';
  }

  const user = new User();
  const errors = await validate(user);

  expect(validationErrorsAsString(errors)).toEqual(
    'email: must be an email (isEmail).',
  );
});

it('fault tollerance', () => {
  const errors: Partial<ValidationError>[] = [{}];
  expect(validationErrorsAsString(errors as ValidationError[])).toEqual('');
  expect(validationErrorsAsString({} as ValidationError)).toEqual('');
  expect(validationErrorsAsString(undefined as any)).toEqual('');
  expect(validationErrorsAsString(null as any)).toEqual('');
});

it('single error', () => {
  const error: ValidationError = {
    property: 'property',
    constraints: { prop: 'error' },
  };
  expect(validationErrorsAsString(error)).toEqual('property: error (prop).');
  expect(validationErrorsAsArray(error)).toEqual(['property: error (prop)']);
});

it('several errors with single constraint', async () => {
  class User {
    @MinLength(3) name = '';
    @IsNotEmpty() password = '';
  }

  const user = new User();
  const errors = await validate(user);

  expect(validationErrorsAsString(errors)).toEqual(stripIndents`
        name: must be longer than or equal to 3 characters (minLength),
        password: should not be empty (isNotEmpty).
        `);
});

it('validationErrorsAsArray', async () => {
  class EmailObject {
    @IsEmail()
    value = '';
  }
  class User {
    @Length(3, 30) name = '';
    @Min(18) age = 0;
    @ValidateNested() email = new EmailObject();
  }
  const user = new User();
  const errors = await validate(user);

  const result = validationErrorsAsArray(errors);

  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(3);
  expect(result).toContainEqual('email.value: must be an email (isEmail)');
});

it('coerce to array', async () => {
  class User {
    @IsEmail() email = '';
  }

  const user = new User();
  const errors = await validate(user);

  expect(validationErrorsAsArray(errors[0] as ValidationError)).toEqual([
    'email: must be an email (isEmail)',
  ]);
});

it('array items', async () => {
  class EmailObject {
    @IsEmail()
    value = '';
  }
  class User {
    @ValidateNested()
    emails = [new EmailObject()];
  }
  const user = new User();
  const errors = await validate(user);

  const result = validationErrorsAsArray(errors);

  expect(result).toContainEqual('emails.0.value: must be an email (isEmail)');
});

it('options delimiter', () => {
  const errors: ValidationError[] = [
    {
      property: 'a',
      constraints: { fail: 'A' },
    },
    {
      property: 'b',
      constraints: { wrong: 'B' },
    },
  ];
  expect(validationError(errors, { delimiter: '; ' })).toEqual(
    'a: A (fail); b: B (wrong)',
  );
});

it('options period', () => {
  const errors: ValidationError[] = [
    {
      property: 'a',
      constraints: { boo: 'A' },
    },
  ];
  expect(validationError(errors, { period: true })).toEqual('a: A (boo).');
});
