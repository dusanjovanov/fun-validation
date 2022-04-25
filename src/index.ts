type ArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

type ValidationFn = (value: any) => boolean;

type ValidationRules<Value> = Value extends Array<any>
  ? [ValidationFn, ValidationRules<ArrayElement<Value>>]
  : Value extends Date
  ? ValidationFn
  : Value extends object
  ? Partial<
      {
        [Key in keyof Value]: ValidationRules<Value[Key]>;
      }
    >
  : ValidationFn;

type InferObjectType<T> = T extends infer G
  ? {
      [Key in keyof G]: ValidationResult<G[Key]>;
    }
  : never;

export type ValidationResult<Value> = Value extends Array<infer ArrayElement>
  ? [boolean, Array<ValidationResult<ArrayElement>>]
  : Value extends Date
  ? boolean
  : Value extends object
  ? InferObjectType<Value>
  : boolean;

const emailRegEx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isStringLongerThan = (len: number) => (value: any) =>
  isString(value) && value.length > len;

export const isStringShorterThan = (len: number) => (value: any) =>
  isString(value) && value.length < len;

export const isStringOfLength = (len: number) => (value: any) =>
  isString(value) && value.length === len;

export const isStringOfMinLength = (len: number) => (value: any) =>
  isString(value) && value.length >= len;

export const isStringOfMaxLength = (len: number) => (value: any) =>
  isString(value) && value.length <= len;

export const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

export const isObject = (value: any): value is Object =>
  value !== null && typeof value === 'object';

export const isPromise = (value: any): value is PromiseLike<any> =>
  isObject(value) && isFunction(value.then);

export const isArray = (value: any) => Array.isArray(value);

export const isArrayLongerThan = (len: number) => (value: any) =>
  isArray(value) && value.length > len;

export const isArrayShorterThan = (len: number) => (value: any) =>
  isArray(value) && value.length < len;

export const isArrayOfLength = (len: number) => (value: any) =>
  isArray(value) && value.length === len;

export const isArrayMinLength = (len: number) => (value: any) =>
  isArray(value) && value.length >= len;

export const isArrayMaxLength = (len: number) => (value: any) =>
  isArray(value) && value.length <= len;

export const isNumber = (value: any) => {
  if (typeof value === 'number') {
    return value - value === 0;
  }
  return false;
};

export const isInteger = Number.isInteger;

export const isFloat = (value: any) =>
  Number(value) === value && value % 1 !== 0;

export const isNumberMoreThan = (n: number) => (value: any) => value > n;

export const isNumberLessThan = (n: number) => (value: any) => value < n;

export const isNumberEqual = (n: number) => (value: any) => value === n;

export const isNumberMin = (n: number) => (value: any) => value >= n;

export const isNumberMax = (n: number) => (value: any) => value <= n;

export const isPattern = (regex: RegExp) => (value: any) => regex.test(value);

export const isEmail = (value: any) => {
  if (!value) return false;
  const emailParts = value.split('@');
  if (emailParts.length !== 2) return false;

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64) return false;
  else if (address.length > 255) return false;

  const domainParts = address.split('.');
  if (
    domainParts.some((part: string) => {
      return part.length > 63;
    })
  )
    return false;

  if (!emailRegEx.test(value)) return false;

  return true;
};

export const isUrl = (value: any) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const objectMap = (
  obj: any,
  fn: (key: string | number, value: any, index: number) => any
) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(k, v, i)]));

export function validate<Value extends any>(
  value: Value,
  rules: ValidationRules<Value>
): ValidationResult<Value> {
  if (isFunction(rules)) {
    return (rules as ValidationFn)(value) as ValidationResult<Value>;
  }
  if (isArray(rules)) {
    if (isFunction(rules[0])) {
      return [
        validate(value, rules[0]),
        (value as Array<any>).map(e => validate(e, rules[1])),
      ] as ValidationResult<Value>;
    }
    return validate(value, rules);
  }
  if (isObject(rules)) {
    return objectMap(value, (key, value) =>
      validate(value, (rules as any)[key])
    ) as ValidationResult<Value>;
  }
  return false as ValidationResult<Value>;
}
