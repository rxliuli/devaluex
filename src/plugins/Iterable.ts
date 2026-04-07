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

export const AsyncIterablePlugin: Plugin<AsyncIterable<any>, any[]> = {
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
  async stringifyAsync(data) {
    const result = []
    for await (const it of data) {
      result.push(it)
    }
    return result
  },
  parse(data) {
    const iterator = (async function* () {
      for (const it of data) {
        yield it
      }
    })()
    return iterator
  },
}
