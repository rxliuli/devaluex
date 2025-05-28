import { Plugin } from './plugin'

export const ResponsePlugin: Plugin<
  Response,
  {
    status: number
    statusText: string
    headers: [string, string][]
    body: Uint8Array
  }
> = {
  name: 'Response',
  test(data) {
    return data instanceof Response
  },
  stringifyAsync(data, ctx) {
    const id = '__' + Date.now() + '__' + Math.random() + '__'
    const clone = data.clone()
    return {
      value: {
        status: clone.status,
        statusText: clone.statusText,
        headers: clone.headers,
        body: id,
      },
      promise: Promise.resolve().then(async () => {
        const bf = await clone.arrayBuffer()
        ctx.result = ctx.result.replace(
          `"${id}"`,
          ctx.stringify(bf).slice(1, -1),
        )
      }),
    }
  },
  parse(data) {
    return new Response(data.body, {
      status: data.status,
      statusText: data.statusText,
      headers: data.headers,
    })
  },
}
