import { testPlugin } from '../test/testPlugin'
import { BlobPlugin, FilePlugin } from './blob'

testPlugin(new Blob(['hello'], { type: 'text/plain' }), BlobPlugin, {
  equal: async (a, b) => {
    return (await a.text()) === (await b.text())
  },
})
testPlugin(
  new File(['hello'], 'test.txt', {
    type: 'text/plain',
    lastModified: Date.now(),
  }),
  FilePlugin,
  {
    equal: async (a, b) => {
      return (
        a.lastModified === b.lastModified &&
        a.name === b.name &&
        a.type === b.type &&
        a.size === b.size &&
        (await a.text()) === (await b.text())
      )
    },
  },
)
