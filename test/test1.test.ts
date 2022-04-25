import { validate, isArray, isString, isInteger, isNumber } from '../src';

describe('isNumber', () => {
  it('integer', () => {
    expect(isNumber(1)).toEqual(true);
  });
  it('float', () => {
    expect(isNumber(1.1)).toEqual(true);
  });
  it('string', () => {
    expect(isNumber('')).toEqual(false);
  });
  it('date', () => {
    expect(isNumber(new Date())).toEqual(false);
  });
  it('promise', () => {
    expect(isNumber(Promise.resolve())).toEqual(false);
  });
  it('NaN', () => {
    expect(isNumber(NaN)).toEqual(false);
  });
  it('null', () => {
    expect(isNumber(null)).toEqual(false);
  });
});

describe('isInteger', () => {
  it('integer', () => {
    expect(isInteger(1)).toEqual(true);
  });
  it('negative integer', () => {
    expect(isInteger(-1)).toEqual(true);
  });
  it('float', () => {
    expect(isInteger(1.1)).toEqual(false);
  });
  it('negative float', () => {
    expect(isInteger(-1.1)).toEqual(false);
  });
  it('string', () => {
    expect(isInteger('')).toEqual(false);
  });
  it('date', () => {
    expect(isInteger(new Date())).toEqual(false);
  });
});

describe('validate', () => {
  it('Array of strings', () => {
    expect(validate(['1', '2', '3'], [isArray, isString])).toEqual([
      true,
      [true, true, true],
    ]);
  });
  it('2-dimesional array of strings ( string[][] )', () => {
    expect(
      validate(
        [
          ['1', '2', '3'],
          ['1', '2', '3'],
        ],
        [isArray, [isArray, isString]]
      )
    ).toEqual([
      true,
      [
        [true, [true, true, true]],
        [true, [true, true, true]],
      ],
    ]);
  });
  it('Array with objects', () => {
    expect(
      validate(
        [
          { name: 'Dusan', age: 29 },
          { name: 'Peter', age: 33 },
        ],
        [isArray, { name: isString, age: isInteger }]
      )
    ).toEqual([
      true,
      [
        {
          name: true,
          age: true,
        },
        {
          name: true,
          age: true,
        },
      ],
    ]);
  });
  it('Object with just primitives', () => {
    expect(
      validate({ name: 'Dusan', age: 29 }, { name: isString, age: isInteger })
    ).toEqual({
      name: true,
      age: true,
    });
  });
  it('Object with array', () => {
    expect(
      validate(
        { friendNames: ['Mike', 'Sarah'] },
        { friendNames: [isArray, isString] }
      )
    ).toEqual({
      friendNames: [true, [true, true]],
    });
  });
});
