import { Plugin } from './plugin'

export const HeadersPlugin: Plugin<Headers, [string, string][]> = {
  name: 'Headers',
  test(data) {
    return data instanceof Headers
  },
  stringify(data) {
    // Use forEach instead of [...data.entries()] because in browser extension
    // content scripts, cross-realm Headers objects have entries() that return
    // iterators without Symbol.iterator, causing spread to throw "not iterable".
    const result: [string, string][] = []
    data.forEach((v, k) => {
      result.push([k, v])
    })
    return result
  },
  parse(data) {
    return new Headers(data)
  },
}
