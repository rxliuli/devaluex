import { testPlugin } from '../test/testPlugin'
import { DataViewPlugin } from './dataview'

testPlugin(new DataView(new ArrayBuffer(16)), DataViewPlugin, {
  name: 'dataview',
})
