import { describe } from 'vitest'
import { testPlugin } from './test/testPlugin'

describe('devaluex', () => {
  testPlugin(NaN, undefined, {
    name: 'NaN',
  })
  testPlugin(Infinity, undefined, {
    name: 'Infinity',
  })
  testPlugin(-Infinity, undefined, {
    name: '-Infinity',
  })
  testPlugin(-0, undefined, {
    name: '-0',
    equal: async (a, b) => Object.is(a, b),
  })
  testPlugin(0, undefined, {
    equal: async (a, b) => Object.is(a, b),
  })
  testPlugin(1, undefined, { name: 'number' })
  testPlugin('hello', undefined, { name: 'string' })
  testPlugin(true, undefined, { name: 'boolean' })
  testPlugin(false, undefined, { name: 'boolean' })
  testPlugin(null, undefined, { name: 'null' })
  testPlugin(undefined, undefined, { name: 'undefined' })
  testPlugin(BigInt(1), undefined, { name: 'bigint' })
  testPlugin([], undefined, { name: 'empty array' })
  testPlugin([1, 2, 3], undefined, { name: 'array' })
  testPlugin([1, 2, , 3], undefined, { name: 'sparse array' })
  testPlugin({ a: 1, b: 2 }, undefined, { name: 'object' })
  testPlugin(/a/, undefined, { name: 'regexp' })
  testPlugin(new Date(), undefined, { name: 'date' })
  testPlugin(new Map([['a', 1]]), undefined, { name: 'map' })
  testPlugin(new Set([1, 2, 3]), undefined, { name: 'set' })
  testPlugin(Object.create(null), undefined, { name: 'Object.create(null)' })
  testPlugin(new ArrayBuffer(1), undefined, { name: 'arraybuffer' })
  testPlugin(new Int8Array([1, 2, 3]), undefined, { name: 'int8array' })
  testPlugin(new Int16Array([1, 2, 3]), undefined, { name: 'int16array' })
  testPlugin(new Int32Array([1, 2, 3]), undefined, { name: 'int32array' })
  testPlugin(new Uint8Array([1, 2, 3]), undefined, { name: 'uint8array' })
  testPlugin(new Uint16Array([1, 2, 3]), undefined, { name: 'uint16array' })
  testPlugin(new Uint32Array([1, 2, 3]), undefined, { name: 'uint32array' })
  testPlugin(new Uint8ClampedArray([1, 2, 3]), undefined, {
    name: 'Uint8ClampedArray',
  })
  testPlugin(new Float32Array([1, 2, 3]), undefined, { name: 'float32array' })
  testPlugin(new Float64Array([1, 2, 3]), undefined, { name: 'float64array' })
  testPlugin(new BigInt64Array([BigInt(1)]), undefined, {
    name: 'bigint64array',
  })
  testPlugin(new BigUint64Array([BigInt(1)]), undefined, {
    name: 'biguint64array',
  })
})
