import {
  bigIntAbs,
  bigIntToNumber,
  floatToBigInt,
  formatCrypto,
  numberToCompactCurrency,
  scale,
  stringToBigInt,
} from '../src/numeric';

test('should convert bigints to numbers', () => {
  const testCases = [
    { value: BigInt(10), expected: 10 },
    { value: BigInt(0), expected: 0 },
    { value: BigInt(-10), expected: -10 },
  ];
  testCases.forEach(({ value, expected }) => {
    expect(bigIntToNumber(value)).toEqual(expected);
  });
});

test('should get absolute values for bigints', () => {
  const testCases = [
    { value: BigInt(-10), expected: 10n },
    { value: BigInt(10), expected: 10n },
    { value: BigInt(0), expected: 0n },
  ];
  testCases.forEach(({ value, expected }) => {
    expect(bigIntAbs(value)).toEqual(expected);
  });
});

test('should convert floats to bigints', () => {
  const testCases = [
    { expected: scale(15683, 15), digits: 5, decimals: 18, value: 15.683 },
    { expected: scale(501340, 0), digits: 5, decimals: 6, value: 0.50134 },
    { expected: scale(5430, 0), digits: 3, decimals: 6, value: 0.00543 },
    { expected: scale(84180923, 18), digits: 5, decimals: 18, value: 84180923 },
  ];
  testCases.forEach(({ value, digits, decimals, expected }) => {
    const actual: bigint = floatToBigInt(value, decimals, digits);
    expect(bigIntAbs(actual - expected)).toEqual(BigInt(0));
  });
});

test('should convert numbers to compact currencies', () => {
  const testCases = [
    { value: 1_203_912, expected: '$1.2m' },
    { value: 1_125_234_230, expected: '$1.1b' },
    { value: 1, expected: '$1.00' },
    { value: 0.213123, expected: '$0.21' },
    { value: 700.123, expected: '$700.12' },
    { value: 0, expected: '$0.00' },
    { value: 12_544, expected: '$12.5k' },
    { value: 456_000, expected: '$456k' },
    { value: 988_912_123_123.123123, expected: '$988.9b' },
    { value: 989_988_912_123_123, expected: '$990t' },
    { value: 889_989_988_912_123_123, expected: '$889,990t' },
  ];
  testCases.forEach(({ value, expected }) =>
    expect(numberToCompactCurrency(value)).toEqual(expected)
  );
});

test('should format numbers as crypto', () => {
  const testCases = [
    { value: 121231.120102, expected: '121,231.12' },
    { value: 121231, expected: '121,231' },
    { value: 0.120102, expected: '0.1201' },
    { value: 0.0000000123, expected: '0.0000000123' },
    { value: 11.12010210230123, expected: '11.1201' },
    { value: 0, expected: '0' },
    { value: 123102031023, expected: '123,102,031,023' },
    { value: 12.000000111, expected: '12' },
    {
      value: 123102031023,
      expected: '123102031023',
      parameters: { useGrouping: false },
    },
    {
      value: 121231.120102,
      expected: '121231.12',
      parameters: { useGrouping: false },
    },
  ];
  testCases.forEach(({ value, expected, parameters }) =>
    expect(formatCrypto(value, parameters)).toEqual(expected)
  );
});

test('stringToBigInt should convert strings to bigints', () => {
  const testCases = [
    { value: '1.23', decimals: 5, expected: BigInt(123000) },
    {
      value: '0.000000000000000001',
      decimals: 18,
      expected: BigInt(1),
    },
    {
      value: '0.0000000000000000001',
      decimals: 18,
      expected: BigInt(0),
    },
    {
      value: '0.00000000000000000001',
      decimals: 20,
      expected: BigInt(1),
    },
    { value: '123.45', decimals: 1, expected: BigInt(1234) },
    { value: '28319', decimals: 4, expected: BigInt(283190000) },
    { value: '-1', decimals: 0, expected: -1n },
    { value: '-123.918', decimals: 3, expected: -123918n },
    {
      value: '10000000000000000000000',
      decimals: 4,
      expected: BigInt(10) ** BigInt(26),
    },
  ];
  testCases.forEach(({ value, decimals, expected }) => {
    expect(stringToBigInt(value, decimals)).toEqual(expected);
  });
});

test('stringToBigInt should truncate', () => {
  const testCases = [
    { value: '1.2345', decimals: 2, expected: BigInt(123) },
    { value: '0.001', decimals: 2, expected: BigInt(0) },
    { value: '1.1', decimals: 2, expected: BigInt('110') },
  ];
  testCases.forEach(({ value, decimals, expected }) => {
    expect(stringToBigInt(value, decimals)).toEqual(expected);
  });
});

test('stringToBigInt should accept scientific notation', () => {
  const testCases = [
    {
      value: '3.456e11',
      decimals: 3,
      expected: BigInt(345600000000000),
    },
    { value: '934e5', decimals: 0, expected: BigInt(93400000) },
    { value: '12.45e0', decimals: 2, expected: BigInt(1245) },
    { value: '0.45e1', decimals: 4, expected: BigInt(45000) },
    {
      value: '10e2',
      decimals: 18,
      expected: BigInt(1000) * BigInt(10) ** BigInt(18),
    },
  ];
  testCases.forEach(({ value, decimals, expected }) => {
    expect(stringToBigInt(value, decimals)).toEqual(expected);
  });
});

test('stringToBigInt should error for invalid numbers', () => {
  const testCases = [
    { value: '', decimals: 2 },
    { value: '.', decimals: 2 },
  ];
  testCases.forEach(({ value, decimals }) => {
    expect(() => stringToBigInt(value, decimals)).toThrowError(
      'errors.invalidNumber'
    );
  });
});

test('stringToBigInt should remove commars', () => {
  const testCases = [
    { value: '1,000', decimals: 2, expected: BigInt(100000) },
    {
      value: '265,232,123.121',
      decimals: 6,
      expected: BigInt(265232123121000),
    },
  ];
  testCases.forEach(({ value, decimals, expected }) => {
    expect(stringToBigInt(value, decimals)).toEqual(expected);
  });
});
