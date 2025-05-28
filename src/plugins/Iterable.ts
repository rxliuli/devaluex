import type { Plugin } from './plugin'

export const IterablePlugin: Plugin<Iterable<any>, any[]> = {
  name: 'Iterable',
  test(data) {
    if (data instanceof Array || data instanceof Set || data instanceof Map) {
      return false
    }
    return (
      typeof data === 'object' &&
      Symbol.iterator in data &&
      data[Symbol.iterator] instanceof Function
    )
  },
  stringify(data) {
    const result = []
    for (const item of data) {
      result.push(item)
    }
    return result
  },
  parse(data) {
    const iterator = (function* () {
      for (const it of data) {
        yield it
      }
    })()
    return iterator
  },
}

export const AsyncIterablePlugin: Plugin<AsyncIterable<any>, Uint8Array> = {
  name: 'AsyncIterable',
  test(data) {
    if (data instanceof Array || data instanceof Set || data instanceof Map) {
      return false
    }
    return (
      typeof data === 'object' &&
      Symbol.asyncIterator in data &&
      data[Symbol.asyncIterator] instanceof Function
    )
  },
  stringifyAsync(data, ctx) {
    const id = '__' + Date.now() + '__' + Math.random() + '__'
    return {
      value: id,
      promise: Promise.resolve().then(async () => {
        let result = []
        for await (const it of data) {
          result.push(it)
        }
        const r = ctx.stringify(new TextEncoder().encode(ctx.stringify(result)))
        ctx.result = ctx.result.replace(`"${id}"`, r.slice(1, -1))
      }),
    }
  },
  parse(data, ctx) {
    const result = ctx.parse(new TextDecoder().decode(data))
    const iterator = (async function* () {
      for (const it of result) {
        yield it
      }
    })()
    return iterator
  },
}
