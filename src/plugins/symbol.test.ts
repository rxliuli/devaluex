import { testPlugin } from '../test/testPlugin'
import { SymbolPlugin } from './symbol'

testPlugin(Symbol.for('symbol'), SymbolPlugin, {
  name: 'symbol',
})
testPlugin(Symbol('test'), SymbolPlugin, {
  name: 'symbol',
  throw: true,
})
