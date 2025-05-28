# devaluex

A plugin system for [devalue](https://github.com/rich-harris/devalue) to serialize and deserialize complex objects with support for async plugins.

## Usage

Use `stringifyAsync` and `parse` for async plugins.

```ts
import { stringifyAsync, parse, BlobPlugin } from 'devaluex'

const a = await stringifyAsync(
  { a: 1, b: new Blob(['123']) },
  {
    plugins: [BlobPlugin],
  },
)
const b = parse(a, {
  plugins: [BlobPlugin],
})
console.log(b) // { a: 1, b: Blob { size: 3, type: '' } }
```

## Supported Types

| Type                           | Supported |
| ------------------------------ | --------- |
| `NaN`                          | ✅        |
| `Infinity`                     | ✅        |
| `-Infinity`                    | ✅        |
| `-0`                           | ✅        |
| `number`                       | ✅        |
| `string`                       | ✅        |
| `boolean`                      | ✅        |
| `null`                         | ✅        |
| `undefined`                    | ✅        |
| `bigint`                       | ✅        |
| `Array`                        | ✅        |
| sparse (holey) `Arrays`        | ✅        |
| `Object`                       | ✅        |
| `RegExp`                       | ✅        |
| `Date`                         | ✅        |
| `Map`                          | ✅        |
| `Set`                          | ✅        |
| `Object.create(null)`          | ✅        |
| `ArrayBuffer`                  | ✅        |
| `DataView`                     | ✅ [^1]   |
| `Int8Array`                    | ✅        |
| `Int16Array`                   | ✅        |
| `Int32Array`                   | ✅        |
| `Uint8Array`                   | ✅        |
| `Uint16Array`                  | ✅        |
| `Uint32Array`                  | ✅        |
| `Uint8ClampedArray`            | ✅        |
| `Float32Array`                 | ✅        |
| `Float64Array`                 | ✅        |
| `BigInt64Array`                | ✅        |
| `BigUint64Array`               | ✅        |
| `Error`                        | ✅ [^1]   |
| `AggregateError`               | ✅ [^1]   |
| `EvalError`                    | ✅ [^1]   |
| `RangeError`                   | ✅ [^1]   |
| `ReferenceError`               | ✅ [^1]   |
| `SyntaxError`                  | ✅ [^1]   |
| `TypeError`                    | ✅ [^1]   |
| `URIError`                     | ✅ [^1]   |
| `Promise`                      | ❌        |
| `Iterable`                     | ✅ [^1]   |
| `Well-known symbols`           | ✅ [^1]   |
| `AsyncIterable`                | ✅ [^1]   |
| `Built-in streaming primitive` | ❌        |
| `Cyclic references`            | ✅        |
| `Isomorphic references`        | ✅        |
| `URL`                          | ✅ [^1]   |
| `URLSearchParams`              | ✅ [^1]   |
| `Blob`                         | ✅ [^1]   |
| `File`                         | ✅ [^1]   |
| `Headers`                      | ✅ [^1]   |
| `FormData`                     | ✅ [^1]   |
| `ReadableStream`               | ✅ [^1]   |
| `Request`                      | ✅ [^1]   |
| `Response`                     | ✅ [^1]   |
| `Event`                        | ✅ [^1]   |
| `CustomEvent`                  | ✅ [^1]   |
| `DOMException`                 | ✅ [^1]   |
| `ImageData`                    | ✅ [^1]   |
| `AbortSignal`                  | ❌        |

[^1]: Need plugin support.
