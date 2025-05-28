import { Plugin } from './plugin'

export const RequestPlugin: Plugin<
  Request,
  {
    url: string
    method: string
    headers: [string, string][]
    body: Uint8Array
  }
> = {
  name: 'Request',
  test(data) {
    return data instanceof Request
  },
  stringifyAsync(data, ctx) {
    const id = '__' + Date.now() + '__' + Math.random() + '__'
    const clone = data.clone()
    return {
      value: {
        url: clone.url,
        method: clone.method,
        headers: clone.headers,
        body: clone.body === null ? null : id,
      },
      promise:
        clone.body === null
          ? Promise.resolve()
          : Promise.resolve().then(async () => {
              const contentType = clone.headers.get('Content-Type')
              if (contentType?.includes('multipart/form-data')) {
                const formData = await clone.formData()
                const b = new TextEncoder().encode(
                  await ctx.stringifyAsync(formData),
                )
                const r = ctx.stringify(b)
                ctx.result = ctx.result.replace(`"${id}"`, r.slice(1, -1))
                return
              }
              const bf = await clone.arrayBuffer()
              ctx.result = ctx.result.replace(
                `"${id}"`,
                ctx.stringify(bf).slice(1, -1),
              )
            }),
    }
  },
  parse(data, ctx) {
    const headers = new Headers(data.headers)
    let body = data.body
    const contentType = headers.get('Content-Type')
    if (contentType?.includes('multipart/form-data')) {
      body = ctx.parse(new TextDecoder().decode(data.body))
      headers.delete('Content-Type')
    }
    return new Request(data.url, {
      method: data.method,
      headers: headers,
      body: body,
    })
  },
}
