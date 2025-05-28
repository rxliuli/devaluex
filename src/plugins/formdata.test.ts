import { expect } from 'vitest'
import { createFormData, testPlugin } from '../test/testPlugin'
import { FormDataPlugin } from './formdata'
import { ReadableStreamPlugin } from './readableStream'
import { stringify } from '../devaluex'

const fd = createFormData([
  [
    'c',
    new File(['hello'], 'test.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    }),
  ],
])
testPlugin(createFormData([['a', 'b']]), FormDataPlugin, {
  name: 'formdata with string and sync',
  stringify: stringify,
  equal: (a, b) => {
    a.forEach((_, key) => {
      expect(a.get(key)).toEqual(b.get(key))
    })
    return true
  },
})
testPlugin(fd, FormDataPlugin, {
  name: 'formdata with file and sync',
  stringify,
  throw: true,
})
testPlugin(createFormData([['a', 'b']]), FormDataPlugin, {
  name: 'formdata with string and async',
  equal: (a, b) => {
    a.forEach((_, key) => {
      expect(a.get(key)).toEqual(b.get(key))
    })
    return true
  },
})
testPlugin(fd, FormDataPlugin, {
  name: 'formdata with file and async',
  equal: (a, b) => {
    a.forEach((_, key) => {
      expect(a.get(key)).toEqual(b.get(key))
    })
    return true
  },
})
testPlugin(
  new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('hello'))
    },
    pull(controller) {
      controller.enqueue(new TextEncoder().encode('world'))
      controller.close()
    },
  }),
  ReadableStreamPlugin,
  {
    name: 'readable stream',
    equal: async (a, b) => {
      expect(
        await Array.fromAsync(a.pipeThrough(new TextDecoderStream())),
      ).toEqual(['hello', 'world'])
      return true
    },
  },
)
