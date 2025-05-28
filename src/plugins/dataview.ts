import type { Plugin } from './plugin'

export const DataViewPlugin: Plugin<DataView, ArrayBufferLike> = {
  name: 'DataView',
  test(data) {
    return data instanceof DataView
  },
  stringify(data) {
    return data.buffer
  },
  parse(data) {
    return new DataView(data)
  },
}
