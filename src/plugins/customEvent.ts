import { Plugin } from './plugin'

export const CustomEventPlugin: Plugin<
  CustomEvent,
  {
    type: string
    detail: unknown
    bubbles: boolean
    cancelable: boolean
    composed: boolean
  }
> = {
  name: 'CustomEvent',
  test(data) {
    return typeof CustomEvent === 'function' && data instanceof CustomEvent
  },
  stringify(data) {
    return {
      type: data.type,
      detail: data.detail,
      bubbles: data.bubbles,
      cancelable: data.cancelable,
      composed: data.composed,
    }
  },
  parse(data) {
    return new CustomEvent(data.type, {
      detail: data.detail,
      bubbles: data.bubbles,
      cancelable: data.cancelable,
      composed: data.composed,
    })
  },
}
