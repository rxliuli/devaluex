import { expect } from 'vitest'
import { testPlugin } from '../test/testPlugin'
import { CustomEventPlugin } from './customEvent'

testPlugin(new CustomEvent('click'), [CustomEventPlugin], {
  name: 'custom event',
  equal: (a) => {
    expect(a.type).eq('click')
    expect(a.detail).null
  },
})
testPlugin(
  new CustomEvent('click', {
    detail: 'Hello, world!',
    bubbles: true,
    cancelable: true,
    composed: true,
  }),
  [CustomEventPlugin],
  {
    name: 'custom event with options',
    equal: (a) => {
      expect(a.detail).eq('Hello, world!')
      expect(a.bubbles).eq(true)
      expect(a.cancelable).eq(true)
      expect(a.composed).eq(true)
    },
  },
)
