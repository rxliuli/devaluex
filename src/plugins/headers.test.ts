import { testPlugin } from '../test/testPlugin'
import { HeadersPlugin } from './headers'

testPlugin(new Headers([['Content-Type', 'application/json']]), HeadersPlugin, {
  name: 'headers',
  equal: (a, b) => {
    return [...a.entries()].join(',') === [...b.entries()].join(',')
  },
})
