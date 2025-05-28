import { expect } from 'vitest'
import { testPlugin } from '../test/testPlugin'
import { DOMExceptionPlugin } from './DOMException'

testPlugin(new DOMException('test'), [DOMExceptionPlugin], {
  name: 'DOMException',
  equal: (a) => {
    expect(a.message).eq('test')
    expect(a.name).eq('Error')
  },
})
testPlugin(new DOMException('test', 'Custom Error'), [DOMExceptionPlugin], {
  name: 'DOMException with name',
  equal: (a) => {
    expect(a.message).eq('test')
    expect(a.name).eq('Custom Error')
  },
})
