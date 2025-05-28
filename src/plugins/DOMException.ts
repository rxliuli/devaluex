import { Plugin } from './plugin'

export const DOMExceptionPlugin: Plugin<
  DOMException,
  {
    name: string
    message: string
  }
> = {
  name: 'DOMException',
  test(data) {
    return typeof DOMException === 'function' && data instanceof DOMException
  },
  stringify(data) {
    return {
      name: data.name,
      message: data.message,
    }
  },
  parse(data) {
    return new DOMException(data.message, data.name)
  },
}
