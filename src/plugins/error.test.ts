import { testPlugin } from '../test/testPlugin'
import { ErrorPlugin } from './error'

testPlugin(new Error('error'), ErrorPlugin, { name: 'error' })
testPlugin(
  new AggregateError([new Error('error')], 'aggregate error'),
  ErrorPlugin,
  { name: 'aggregate error' },
)
testPlugin(new EvalError('eval error'), ErrorPlugin, {
  name: 'eval error',
})
testPlugin(new RangeError('range error'), ErrorPlugin, {
  name: 'range error',
})
testPlugin(new ReferenceError('reference error'), ErrorPlugin, {
  name: 'reference error',
})
testPlugin(new SyntaxError('syntax error'), ErrorPlugin, {
  name: 'syntax error',
})
testPlugin(new TypeError('type error'), ErrorPlugin, { name: 'type error' })
testPlugin(new URIError('uri error'), ErrorPlugin, { name: 'uri error' })
