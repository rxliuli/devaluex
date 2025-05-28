import { Plugin } from './plugin'

export const EventPlugin: Plugin<
  Event,
  {
    type: string
    bubbles: boolean
    cancelable: boolean
    composed: boolean
  }
> = {
  name: 'Event',
  test(data) {
    return typeof Event === 'function' && data instanceof Event
  },
  stringify(data) {
    return {
      type: data.type,
      bubbles: data.bubbles,
      cancelable: data.cancelable,
      composed: data.composed,
    }
  },
  parse(data) {
    return new Event(data.type, {
      bubbles: data.bubbles,
      cancelable: data.cancelable,
      composed: data.composed,
    })
  },
}


