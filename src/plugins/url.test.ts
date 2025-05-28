import { testPlugin } from '../test/testPlugin'
import { URLPlugin, URLSearchParamsPlugin } from './url'

testPlugin(new URL('https://example.com/test?term=keyword'), URLPlugin, {
  equal(a, b) {
    return a.toString() === b.toString()
  },
})
testPlugin(new URLSearchParams([['term', 'keyword']]), URLSearchParamsPlugin, {
  name: 'urlsearchparams',
  equal: (a, b) => a.toString() === b.toString(),
})
