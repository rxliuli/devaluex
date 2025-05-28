import { Plugin } from './plugin'

export const URLPlugin: Plugin<URL, string> = {
  name: 'URL',
  test(data) {
    return data instanceof URL
  },
  stringify(data) {
    return data.toString()
  },
  parse(data) {
    return new URL(data)
  },
}

export const URLSearchParamsPlugin: Plugin<URLSearchParams, string> = {
  name: 'URLSearchParams',
  test(data) {
    return data instanceof URLSearchParams
  },
  stringify(data) {
    return data.toString()
  },
  parse(data) {
    return new URLSearchParams(data)
  },
}
