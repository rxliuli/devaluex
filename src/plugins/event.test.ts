import { expect } from 'vitest'
import { testPlugin } from '../test/testPlugin'
import { EventPlugin } from './event'

testPlugin(new Event('click'), [EventPlugin], {
  name: 'event',
  equal: (a) => {
    expect(a.type).eq('click')
  },
})
testPlugin(
  new Event('click', { bubbles: true, cancelable: true, composed: true }),
  [EventPlugin],
  {
    name: 'event with options',
    equal: (a) => {
      expect(a.bubbles).eq(true)
      expect(a.cancelable).eq(true)
      expect(a.composed).eq(true)
    },
  },
)
