# Fun validation

# 🥳

JS Functional validation library

# Usage

This library exports a bunch of small validation functions that all have the following signature:
```tsx
  (value: any) => boolean 
  
  // or when the validation requires additional parameters, we have currying:
  (n:number) => (value: any) => boolean
```

So you would call a function like this:
```tsx
  import { isEmail } from "fun-validation"

  const isEmailValid = isEmail(someString)
```

The library also exports the `validate` function. 

This function has the following signature: 

```tsx
  (value: any, rules) => validationResult
```

Where:

- `rules` must have the same shape as the value that was passed in
- and consequently the `validationResult` will also be in that same shape

Meaning:

- If the `value` is a primitive (string, number...etc), the `rules` must be a validation fn with the signature: `(value: any) => boolean`, and the `validationResult` will be a boolean

```tsx
   import { validate, isString, isInteger, isNumberMax } from "fun-validation"
  
   const someString = "this is a string"
  
   validate(someString, isString) // returns boolean
   
   // or, you can compose your own validation fn
   
   const someNumber = 3
   
   validate(someNumber, (value) => isInteger(value) && isNumberMax(5)(value)) // returns boolean
```

- If the `value` is an object (a plain object), the `rules` must an object with the same shape as value but the leaf nodes (primitives) have validation fns as values, and the `validationResult` will be and object in the same shape

```tsx
  import { validate, isString } from "fun-validation"
  import { isDate } from "date-fns"
  
  const user = {
    name: "Dusan",
    dateOfBirth: new Date(1992, 9, 2)
  }
  
  const rules = {
    name: isString,
    dateOfBirth: isDate
  }
  
  const result = validate(user, rules)
  
  // result has the shape
  {
    name: boolean;
    dateOfBirth: boolean
  }
```
