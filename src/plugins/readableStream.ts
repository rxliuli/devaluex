import { Plugin } from './plugin'

export const ReadableStreamPlugin: Plugin<ReadableStream, Uint8Array> = {
  name: 'ReadableStream',
  test(data) {
    return (
      typeof ReadableStream !== 'undefined' && data instanceof ReadableStream
    )
  },
  stringifyAsync(data, ctx) {
    const id = '__' + Date.now() + '__' + Math.random() + '__'
    return {
      value: id,
      promise: Promise.resolve().then(async () => {
        const reader = data.getReader()
        const chunks: Uint8Array[] = []
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          chunks.push(value)
        }
        const r = ctx.stringify(new TextEncoder().encode(ctx.stringify(chunks)))
        ctx.result = ctx.result.replace(`"${id}"`, r.slice(1, -1))
      }),
    }
  },
  parse(data, ctx) {
    const result = ctx.parse(
      new TextDecoder().decode(data),
    ) as Uint8Array<ArrayBufferLike>[]
    let i = 1
    return new ReadableStream({
      start(controller) {
        if (result.length === 0) {
          return
        }
        controller.enqueue(result[0])
      },
      pull(controller) {
        if (i >= result.length) {
          controller.close()
          return
        }
        controller.enqueue(result[i])
        i++
      },
    })
  },
}
