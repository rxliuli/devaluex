import type { Plugin } from './plugin'
import { serializeError, deserializeError, ErrorObject } from 'serialize-error'

export const ErrorPlugin: Plugin<Error, ErrorObject> = {
  name: 'Error',
  test(data) {
    return data instanceof Error
  },
  stringify(data) {
    return serializeError(data)
  },
  parse(data) {
    return deserializeError(data)
  },
}
