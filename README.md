# Scaled Number

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

[build-img]: https://github.com/backdfund/scaled-number/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/backdfund/scaled-number/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/scaled-number
[downloads-url]: https://www.npmtrends.com/scaled-number
[npm-img]: https://img.shields.io/npm/v/scaled-number
[npm-url]: https://www.npmjs.com/package/scaled-number
[issues-img]: https://img.shields.io/github/issues/backdfund/scaled-number
[issues-url]: https://github.com/backdfund/scaled-number/issues
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release

> A class for managing large numbers with a decimal scale, useful for web3 development.

## Install

```bash
yarn add scaled-number
```

## Basic Usage

```ts
import { ScaledNumber } from 'scaled-number';

const scaledNumber = ScaledNumber.fromUnscaled(123);
console.log(scaledNumber.mul(10));
```

## Example Web3 Usage

```ts
import { ScaledNumber } from 'scaled-number';
import { BigNumber } from "ethers";
import { getTokenDecimals, getContract, getPrice } from "helpers";

export interface Pool {
	symbol: string;
	tvl: ScaledNumber;
	apy: ScaledNumber;
}

// Returns some key info about a Pool
export const getPoolInfo = async (poolAddress: string): Pool => {
  const pool = getContract(poolAddress);

  // Getting Pool info
  const [
    underlyingAddress,
    tvlBN,
    apyBN
  ] = await Promise.all([
    pool.underlyingAddress(),
    pool.tvl(),
    pool.apy(),
  ]);

  // Getting the underlying info
  const underlying = getContract(underlyingAddress);
  const [
    decimals,
    symbol
  ] = await Promise.all([
    underlying.decimals(),
    underlying.symbol()
  ]);

  // Getting the TVL as a Scaled Number (using the underlying decimals)
  const tvl = new ScaledNumber(tvlBN, decimals);

  // Getting the APY as a Scaled Number (uses default 18 decimals)
  const apy = new ScaledNumber(apyBN);

  return {
    symbol
    tvl,
    apy
  }
}

// Logs key information about a pool
export const logPoolInfo = async (pool: Pool): void => {
  // Getting the price of the underlying
  const price = await getPrice(pool.symbol);

  console.log(`Underlying Balance: ${pool.tvl.toCryptoString()} ${pool.symbol}`);
  // Output: `Underlying Balance: 12,456.87 ETH`

  console.log(`TVL: ${pool.tvl.toCompactUsdValue(price)}`);
  // Output: `TVL: $13.4m`

  console.log(pool.apy.toPercent())
  // Output: `24.34%`
}
```

## Creating Scaled Number

### From BigNumber

```ts
new ScaledNumber(bigNumber: BigNumber, decimals?: number);
```

```ts
import { ScaledNumber } from 'scaled-number';
import { BigNumber } from 'ethers';

const bigNumber = BigNumber.from(123);
const scaledNumber = new ScaledNumber(bigNumber);
```

### From Unscaled

```ts
fromUnscaled(value: number | string = 0, decimals = 18)
```

```ts
import { ScaledNumber } from 'scaled-number';

const scaledNumber = ScaledNumber.fromUnscaled(123, 8);
```

### From Plain

```ts
fromPlain(value: PlainScaledNumber)
```

```ts
import { ScaledNumber } from 'scaled-number';

const scaledNumber = ScaledNumber.fromPlain({
  value: '123000000',
  decimals: 6,
});
```

## Manipulate

### Add

```ts
add(other: ScaledNumber)
```

```ts
const one = ScaledNumber.fromUnscaled(1);
const two = ScaledNumber.fromUnscaled(2);

const three = one.add(two);

console.log(three.toString()); // 3
```

### Subtract

```ts
sub(other: ScaledNumber)
```

```ts
const three = ScaledNumber.fromUnscaled(3);
const two = ScaledNumber.fromUnscaled(2);

const one = three.sub(two);

console.log(one.toString()); // 1
```

### Maximum

```ts
max(other: ScaledNumber)
```

```ts
const three = ScaledNumber.fromUnscaled(3);
const two = ScaledNumber.fromUnscaled(2);

const max = three.max(two);

console.log(max.toString()); // 3
```

### Mimimum

```ts
min(other: ScaledNumber)
```

```ts
const three = ScaledNumber.fromUnscaled(3);
const two = ScaledNumber.fromUnscaled(2);

const min = three.min(two);

console.log(min.toString()); // 2
```

### Multiply

```ts
mul(value: number | string | ScaledNumber)
```

```ts
const three = ScaledNumber.fromUnscaled(3);

const six = three.mul(2);

console.log(six.toString()); // 6
```

### Divide

```ts
div(value: number | string | ScaledNumber)
```

```ts
const six = ScaledNumber.fromUnscaled(3);

const three = three.div(2);

console.log(three.toString()); // 3
```

## Display

### String

```ts
toString(): string
```

```ts
const sn = ScaledNumber.fromUnscaled(1.234);

console.log(sn.toString()); // 1.234
```

### Number

```ts
toNumber(): number
```

```ts
const sn = ScaledNumber.fromUnscaled(1.234);

console.log(sn.toNumber()); // 1.234
```

### Crypto String

```ts
toCryptoString(): string
```

```ts
const sn = ScaledNumber.fromUnscaled('12345678.12345678');

console.log(sn.toCryptoString()); // 12,345,678
```

```ts
const sn = ScaledNumber.fromUnscaled('12.12345678');

console.log(sn.toCryptoString()); // 12.123
```

```ts
const sn = ScaledNumber.fromUnscaled('0.0000000123');

console.log(sn.toCryptoString()); // 0.0000000123
```

### Crypto String

```ts
toCryptoString(): string
```

```ts
const sn = ScaledNumber.fromUnscaled('12345678.12345678');

console.log(sn.toCryptoString()); // 12,345,678
```

```ts
const sn = ScaledNumber.fromUnscaled('12.12345678');

console.log(sn.toCryptoString()); // 12.123
```

```ts
const sn = ScaledNumber.fromUnscaled('0.0000000123');

console.log(sn.toCryptoString()); // 0.0000000123
```

### USD Value

```ts
toUsdValue(price: number): string
```

```ts
const sn = ScaledNumber.fromUnscaled('12345678.12345678');

console.log(sn.toUsdValue(7)); // $86,419,746.86
```

### Compact USD Value

```ts
toCompactUsdValue(price: number): string
```

```ts
const sn = ScaledNumber.fromUnscaled('12345678.12345678');

console.log(sn.toCompactUsdValue(7)); // $86,4m
```

### Percent

```ts
toPercent(): string
```

```ts
const sn = ScaledNumber.fromUnscaled('0.12345678');

console.log(sn.toPercent()); // 12.34%
```

## Query

### Value

```ts
value: BigNumber;
```

```ts
const sn = ScaledNumber.fromUnscaled('0.123', 5);

console.log(sn.value.toString()); // 12300
```

### Decimals

```ts
decimals: number;
```

```ts
const sn = ScaledNumber.fromUnscaled('0.123', 5);

console.log(sn.decimals); // 5
```

### toPlain

```ts
toPlain(): PlainScaledNumber
```

```ts
const sn = ScaledNumber.fromUnscaled('0.123', 5);

console.log(sn.toPlain()); // { value: "12300", decimals: 5 }
```

### Is Zero

```ts
isZero(): boolean
```

```ts
const sn = ScaledNumber.fromUnscaled('0.123', 5);

console.log(sn.isZero()); // false
```

```ts
const sn = ScaledNumber.fromUnscaled();

console.log(sn.isZero()); // true
```

### Is Negative

```ts
isNegative(): boolean
```

```ts
const sn = ScaledNumber.fromUnscaled('0.123', 5);

console.log(sn.isNegative()); // false
```

```ts
const sn = ScaledNumber.fromUnscaled('-0.123', 5);

console.log(sn.isNegative()); // true
```

### Equal

```ts
eq(): boolean
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(2);

console.log(first.eq(second)); // false
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(1);

console.log(first.eq(second)); // true
```

### Greater Than

```ts
gt(): boolean
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(2);

console.log(first.gt(second)); // false
```

### Greater Than or Equal

```ts
gte(): boolean
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(1);

console.log(first.gte(second)); // true
```

### Less Than

```ts
lt(): boolean
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(2);

console.log(first.lt(second)); // true
```

### Less Than or Equal

```ts
lte(): boolean
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(1);

console.log(first.lte(second)); // true
```

### Less Than or Equal

```ts
lte(): boolean
```

```ts
const first = ScaledNumber.fromUnscaled(1);
const second = ScaledNumber.fromUnscaled(1);

console.log(first.lte(second)); // true
```
