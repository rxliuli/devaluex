import { Plugin } from './plugin'

export const HeadersPlugin: Plugin<Headers, [string, string][]> = {
  name: 'Headers',
  test(data) {
    return data instanceof Headers
  },
  stringify(data) {
    return [...data.entries()]
  },
  parse(data) {
    return new Headers(data)
  },
}
