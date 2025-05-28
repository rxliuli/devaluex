import { assert, expect, it } from 'vitest'
import { RequestPlugin } from './request'
import { HeadersPlugin } from './headers'
import { createFormData, testPlugin } from '../test/testPlugin'
import { FormDataPlugin } from './formdata'

function strToArrayBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer
}

function arrayBufferToStr(arrayBuffer: ArrayBuffer): string {
  return new TextDecoder().decode(arrayBuffer)
}

testPlugin(
  new Request('https://example.com', {
    method: 'GET',
    headers: new Headers([['Content-Type', 'application/json']]),
  }),
  [HeadersPlugin, RequestPlugin],
  {
    name: 'simple get',
    equal: (a, b) =>
      a.url === b.url &&
      a.method === b.method &&
      a.headers.toString() === b.headers.toString(),
  },
)
testPlugin(
  new Request('https://example.com', {
    method: 'POST',
    headers: new Headers([['Content-Type', 'application/json']]),
    body: JSON.stringify({ a: 1 }),
  }),
  [HeadersPlugin, RequestPlugin],
  {
    name: 'text body',
    equal: async (a, b) => {
      expect(await a.json()).toEqual({ a: 1 })
    },
  },
)
testPlugin(
  new Request('https://example.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a: 1 }),
  }),
  [HeadersPlugin, RequestPlugin],
  {
    name: 'json body',
    equal: async (a, b) => {
      expect(await a.json()).toEqual({ a: 1 })
    },
  },
)
testPlugin(
  new Request('https://example.com', {
    method: 'POST',
    body: createFormData([['a', '1']]),
  }),
  [RequestPlugin, HeadersPlugin, FormDataPlugin],
  {
    name: 'formdata body',
    equal: async (a, b) => {
      const fd = await a.formData()
      expect([...fd.entries()]).toEqual([['a', '1']])
    },
  },
)
testPlugin(
  new Request('https://example.com', {
    method: 'POST',
    body: createFormData([
      [
        'a',
        new File(['hello'], 'test.txt', {
          type: 'text/plain',
          lastModified: Date.now(),
        }),
      ],
    ]),
  }),
  [RequestPlugin, HeadersPlugin, FormDataPlugin],
  {
    name: 'formdata file body',
    equal: async (a, b) => {
      const fd = await a.formData()
      const file = fd.get('a')!
      assert(typeof file === 'object')
      expect(file.name).eq('test.txt')
      expect(file.type).eq('text/plain')
      expect(await file.text()).eq('hello')
    },
  },
)
testPlugin(
  new Request('https://example.com', {
    method: 'POST',
    body: strToArrayBuffer(JSON.stringify({ name: 'John' })),
  }),
  [RequestPlugin, HeadersPlugin],
  {
    name: 'arraybuffer body',
    equal: async (a, b) => {
      const body = await a.arrayBuffer()
      expect(arrayBufferToStr(body)).eq(JSON.stringify({ name: 'John' }))
    },
  },
)
testPlugin(
  new Request('https://example.com', {
    method: 'POST',
    body: new ReadableStream({
      start(controller) {
        const a = 'Hello, world!'.split('')
        for (const char of a) {
          controller.enqueue(char)
        }
        controller.close()
      },
    }).pipeThrough(new TextEncoderStream()),
    // @ts-expect-error
    duplex: 'half',
  }),
  [RequestPlugin, HeadersPlugin],
  {
    name: 'stream body',
    equal: async (a) => {
      const r = await Array.fromAsync(
        a.body!.pipeThrough(new TextDecoderStream()),
      )
      expect(r).toEqual(['Hello, world!'])
    },
  },
)
