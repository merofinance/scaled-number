import {
  bigIntToString,
  formatCrypto,
  formatCurrency,
  formatPercent,
  numberToCompactCurrency,
  stringToBigInt,
} from './numeric';
import { BigNumber } from 'bignumber.js';

export interface PlainScaledNumber {
  value: string;
  decimals: number;
}

export class ScaledNumber {
  private _value: bigint;

  private _decimals: number;

  constructor(value: bigint | null | BigNumber = BigInt(0), decimals = 18) {
    // Handle BigNumber
    if (value instanceof BigNumber) {
      value = stringToBigInt(value.toString(), 0);
    }

    // Handle biging
    this._decimals = decimals;
    this._value = value || BigInt(0);
  }

  static fromUnscaled(value: number | string = 0, decimals = 18): ScaledNumber {
    return new ScaledNumber(
      stringToBigInt(value.toString() || '0', decimals),
      decimals
    );
  }

  static fromPlain(value: PlainScaledNumber): ScaledNumber {
    if (!value) return new ScaledNumber();
    return new ScaledNumber(BigInt(value.value), value.decimals);
  }

  static isValid(value: number | string, decimals = 18): boolean {
    try {
      ScaledNumber.fromUnscaled(value, decimals);
      return true;
    } catch {
      return false;
    }
  }

  get value(): bigint {
    return this._value;
  }

  get decimals(): number {
    return this._decimals;
  }

  private scale = (decimals: number) => {
    return BigInt(10) ** BigInt(decimals);
  };

  toPlain = (): PlainScaledNumber => {
    return {
      value: this._value.toString(),
      decimals: this._decimals,
    };
  };

  isZero = (): boolean => this.value === BigInt(0);

  isNegative = (): boolean => this.value < BigInt(0);

  standardizeDecimals(other: ScaledNumber): ScaledNumber {
    if (this.decimals === other.decimals) return other;
    if (this.decimals >= other.decimals) {
      return new ScaledNumber(
        other.value * BigInt(10) ** BigInt(this._decimals - other.decimals),
        this.decimals
      );
    }
    return new ScaledNumber(
      other.value / BigInt(10) ** BigInt(other.decimals - this._decimals),
      this.decimals
    );
  }

  add(other: ScaledNumber): ScaledNumber {
    other = this.standardizeDecimals(other);
    return new ScaledNumber(this.value + other.value, this.decimals);
  }

  sub(other: ScaledNumber): ScaledNumber {
    other = this.standardizeDecimals(other);
    return new ScaledNumber(this.value - other.value, this.decimals);
  }

  eq(other: ScaledNumber): boolean {
    return this.value === other.value && this.decimals === other.decimals;
  }

  gt(other: ScaledNumber): boolean {
    other = this.standardizeDecimals(other);
    return this.value > other.value;
  }

  gte(other: ScaledNumber): boolean {
    other = this.standardizeDecimals(other);
    return this.value >= other.value;
  }

  lt(other: ScaledNumber): boolean {
    other = this.standardizeDecimals(other);
    return this.value < other.value;
  }

  lte(other: ScaledNumber): boolean {
    other = this.standardizeDecimals(other);
    return this.value <= other.value;
  }

  max(other: ScaledNumber): ScaledNumber {
    other = this.standardizeDecimals(other);
    return this.value > other.value ? this : other;
  }

  min(other: ScaledNumber): ScaledNumber {
    other = this.standardizeDecimals(other);
    return this.value < other.value ? this : other;
  }

  mul(value: number | string | ScaledNumber): ScaledNumber {
    const scaledValue =
      value instanceof ScaledNumber
        ? value.value
        : stringToBigInt(value.toString(), this.decimals);
    const scaledDecimals =
      value instanceof ScaledNumber ? value.decimals : this.decimals;
    return new ScaledNumber(
      (this.value * scaledValue) / this.scale(scaledDecimals),
      this.decimals
    );
  }

  div(value: number | string | ScaledNumber): ScaledNumber {
    const scaledValue =
      value instanceof ScaledNumber
        ? value.value
        : stringToBigInt(value.toString(), this.decimals);
    if (scaledValue === BigInt(0)) return new ScaledNumber();
    const scaledDecimals =
      value instanceof ScaledNumber ? value.decimals : this.decimals;
    return new ScaledNumber(
      (this.value * this.scale(scaledDecimals)) / scaledValue,
      this.decimals
    );
  }

  toString = (): string => bigIntToString(this._value, this._decimals);

  toNumber = (): number => Number(this.toString());

  toCryptoString = (parameters: Intl.NumberFormatOptions = {}): string =>
    formatCrypto(Number(this.toString()), parameters);

  toUsdValue = (price: number): string =>
    formatCurrency(Number(this.toString()) * price);

  toCompactUsdValue = (price: number): string =>
    numberToCompactCurrency(Number(this.toString()) * price);

  toPercent = (): string => formatPercent(Number(this.toString()));
}
