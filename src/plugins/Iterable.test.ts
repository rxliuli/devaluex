import { testPlugin } from '../test/testPlugin'
import { IterablePlugin, AsyncIterablePlugin } from './Iterable'

testPlugin(
  (function* () {
    yield 1
    yield 2
    yield 3
  })(),
  IterablePlugin,
  {
    name: 'iterable',
    equal: (a) => {
      return Array.from(a).join(',') === '1,2,3'
    },
  },
)
testPlugin(
  (async function* () {
    yield 1
    yield 2
    yield 3
  })(),
  AsyncIterablePlugin,
  {
    name: 'async iterable',
    equal: async (a) => {
      return (await Array.fromAsync(a)).join(',') === '1,2,3'
    },
  },
)
