import { expect } from 'vitest'
import { HeadersPlugin } from './headers'
import { testPlugin } from '../test/testPlugin'
import { ResponsePlugin } from './response'

testPlugin(
  new Response('Hello, world!', {
    headers: {
      'Content-Type': 'text/plain',
    },
  }),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'text response',
    equal: async (a) => {
      expect(a.ok).true
      expect([...a.headers.entries()]).toEqual([['content-type', 'text/plain']])
      expect(await a.text()).eq('Hello, world!')
    },
  },
)
testPlugin(
  new Response(JSON.stringify({ name: 'John' }), {
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'json response',
    equal: async (a) => {
      expect([...a.headers.entries()]).toEqual([
        ['content-type', 'application/json'],
      ])
      expect(await a.json()).toEqual({ name: 'John' })
    },
  },
)
testPlugin(
  new Response(new Blob(['Hello, world!'])),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'blob response',
    equal: async (a) => {
      expect(await a.text()).toEqual('Hello, world!')
    },
  },
)
testPlugin(
  new Response(new ArrayBuffer(128), {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  }),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'arraybuffer response',
    equal: async (a) => {
      expect(await a.arrayBuffer()).toEqual(new ArrayBuffer(128))
    },
  },
)
testPlugin(
  new Response(
    new ReadableStream({
      start(controller) {
        const a = 'Hello, world!'.split('')
        for (const char of a) {
          controller.enqueue(char)
        }
        controller.close()
      },
    }).pipeThrough(new TextEncoderStream()),
  ),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'stream response',
    equal: async (a) => {
      const reader = a
        .clone()
        .body!.pipeThrough(new TextDecoderStream())
        .getReader()

      let r = ''
      let chunk = await reader.read()
      while (!chunk?.done) {
        r += chunk.value
        chunk = await reader.read()
      }
      expect(r).eq('Hello, world!')
      expect(await a.text()).eq('Hello, world!')
    },
  },
)
testPlugin(
  new Response('Server Error', {
    status: 500,
  }),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'error response',
    equal: async (a) => {
      expect(a.status).eq(500)
      expect(await a.text()).eq('Server Error')
    },
  },
)
testPlugin(
  new Response(null, {
    status: 302,
    headers: {
      Location: 'https://example.com',
    },
  }),
  [ResponsePlugin, HeadersPlugin],
  {
    name: 'redirect response',
    equal: async (a) => {
      expect(a.status).eq(302)
      expect(a.headers.get('Location')).eq('https://example.com')
    },
  },
)
