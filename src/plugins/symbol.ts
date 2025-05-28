import type { Plugin } from './plugin'

export const SymbolPlugin: Plugin<symbol, string> = {
  name: 'Symbol',
  test(data) {
    if (typeof data !== 'symbol') {
      return false
    }
    const key = Symbol.keyFor(data)
    if (key === undefined) {
      throw new Error('Only registered symbols are supported')
    }
    return true
  },
  stringify(data) {
    return Symbol.keyFor(data)!
  },
  parse(data) {
    return Symbol.for(data)
  },
}
