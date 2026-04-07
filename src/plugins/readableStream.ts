import { Plugin } from './plugin'

// NOTE: WebKit/Safari does not support async iteration (Symbol.asyncIterator) on ReadableStream.
// Using `Array.fromAsync(stream)` or `for await...of` silently returns empty results.
// Use `getReader()` to consume streams for cross-browser compatibility.
// Tracked: https://github.com/WebKit/standards-positions/issues/319
// Can I Use: https://caniuse.com/mdn-api_readablestream_--asynciterator
export const ReadableStreamPlugin: Plugin<ReadableStream, Uint8Array[]> = {
  name: 'ReadableStream',
  test(data) {
    return (
      typeof ReadableStream !== 'undefined' && data instanceof ReadableStream
    )
  },
  async stringifyAsync(data) {
    const reader = data.getReader()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      chunks.push(value)
    }
    return chunks
  },
  parse(data) {
    let i = 1
    return new ReadableStream({
      start(controller) {
        if (data.length === 0) {
          return
        }
        controller.enqueue(data[0])
      },
      pull(controller) {
        if (i >= data.length) {
          controller.close()
          return
        }
        controller.enqueue(data[i])
        i++
      },
    })
  },
}
