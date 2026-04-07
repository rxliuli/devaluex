import { Plugin } from './plugin'

export const ResponsePlugin: Plugin<
  Response,
  {
    status: number
    statusText: string
    headers: [string, string][]
    body: ArrayBuffer
  }
> = {
  name: 'Response',
  test(data) {
    return data instanceof Response
  },
  async stringifyAsync(data) {
    const clone = data.clone()
    const headers: [string, string][] = []
    clone.headers.forEach((v, k) => headers.push([k, v]))
    return {
      status: clone.status,
      statusText: clone.statusText,
      headers,
      body: await clone.arrayBuffer(),
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
