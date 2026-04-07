import { Plugin } from './plugin'

// NOTE: Firefox/WebKit do NOT support ReadableStream as Request body.
// Passing a ReadableStream to `new Request(url, { body: stream })` causes
// Firefox to call .toString() on the stream, resulting in "[object ReadableStream]"
// and silently losing all original data. This is a browser limitation, not a plugin bug.
// Tracked since 2017: https://bugzilla.mozilla.org/show_bug.cgi?id=1387483
export const RequestPlugin: Plugin<
  Request,
  {
    url: string
    method: string
    headers: [string, string][]
    body: ArrayBuffer | null
  }
> = {
  name: 'Request',
  test(data) {
    return data instanceof Request
  },
  async stringifyAsync(data, ctx) {
    const clone = data.clone()
    // Don't use clone.body to check — Playwright's Firefox returns undefined
    // for Request.body even when the request has a body. Use method instead.
    const isBodyless = ['GET', 'HEAD'].includes(clone.method)
    let body: ArrayBuffer | null = null
    if (!isBodyless) {
      const contentType = clone.headers.get('Content-Type')
      if (contentType?.includes('multipart/form-data')) {
        const formData = await clone.formData()
        body = new TextEncoder().encode(
          await ctx.stringifyAsync(formData),
        ).buffer as ArrayBuffer
      } else {
        body = await clone.arrayBuffer()
      }
    }
    const headers: [string, string][] = []
    clone.headers.forEach((v, k) => headers.push([k, v]))
    return {
      url: clone.url,
      method: clone.method,
      headers,
      body,
    }
  },
  parse(data, ctx) {
    const headers = new Headers(data.headers)
    let body = data.body
    const contentType = headers.get('Content-Type')
    if (contentType?.includes('multipart/form-data')) {
      body = ctx.parse(new TextDecoder().decode(data.body!))
      headers.delete('Content-Type')
    }
    const init: RequestInit = {
      method: data.method,
      headers: headers,
    }
    if (body != null) {
      init.body = body as BodyInit
    }
    return new Request(data.url, init)
  },
}
