import { map } from 'rxjs'; //
import type { Transform, AsyncTransform } from './replacer.js'; // Importiere die Interface aus replacer.ts

const asyncReviver: AsyncTransform[] = [
  //
  {
    validator: () => true,
    handler: () => source => source.pipe(map(value => value))
  } //
];

export const syncReviver: Transform[] = [
  //
  {
    validator: (value: unknown) => isValidUrl(value),
    handler: (value: string) => new URL(value)
  }, //
  {
    validator: (value: unknown) => isValidISODateString(value),
    handler: (value: string) => new Date(value)
  }, //
  {
    validator: (value: unknown) => isBigInt(value),
    handler: (value: string) => BigInt(value.slice(0, -1))
  }, //
  {
    validator: (value: unknown) => isRegExp(value),
    handler: (value: string) => regExpFromString(value)
  }, //
  {
    validator: (value: unknown) => isSymbol(value),
    handler: (value: string) => symbolFromString(value)
  }, //
  { validator: () => true, handler: (value: unknown) => value } //
];

export const createSyncReviver = (
  transforms: Transform[] = []
): Transform[] => [...transforms, ...syncReviver]; //
export const createAsyncReviver = (
  transforms: AsyncTransform[] = []
): AsyncTransform[] => [...transforms, ...asyncReviver]; //

const isValidUrl = (
  value: unknown
): value is string => //
  isString(value) && URL.canParse(value) && /^[\w]+:\/\/\S+$/gm.test(value); //

const isValidISODateString = (value: unknown): value is string => {
  //
  if (typeof value !== 'string' || value.trim() === '') {
    //
    return false; //
  }
  const d = new Date(value); //
  return !Number.isNaN(d.valueOf()) && d.toISOString() === value; //
};

const isString = (value: unknown): value is string =>
  value?.constructor === String; //
const isBigInt = (value: unknown): value is string =>
  isString(value) && /^\d+n$/.test(value); //
const isRegExp = (value: unknown): value is string =>
  isString(value) && /^\/.*\/[gimuy]*$/.test(value); //
const isSymbol = (value: unknown): value is string =>
  isString(value) && /(\w?)Symbol\((\w+)\)/g.test(value); //

const regExpFromString = (value: string): RegExp => {
  //
  const match = value.match(/^\/(.*)\/([gimuy]*)$/); //
  if (!match) {
    throw new Error(`Invalid RegExp string: ${value}`);
  }
  const [, pattern, flags] = match; //
  return new RegExp(pattern, flags); //
};

const symbolFromString = (value: string): symbol => {
  //
  const match = /(?<prefix>\w?)Symbol\((?<name>\w+)\)/g.exec(value); //
  if (!match || !match.groups) {
    throw new Error(`Invalid Symbol string: ${value}`);
  }
  const { prefix, name } = match.groups; //
  if (prefix === 'g') {
    //
    return Symbol.for(name); //
  }
  return Symbol(name); //
};
