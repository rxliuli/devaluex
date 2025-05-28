import type { Plugin } from './plugin'

export const BlobPlugin: Plugin<Blob, [string, ArrayBuffer]> = {
  name: 'Blob',
  test(data) {
    return typeof Blob !== 'undefined' && data instanceof Blob
  },
  stringifyAsync(data, ctx) {
    const id = '__' + Date.now() + '__' + Math.random() + '__'
    return {
      value: [data.type, id],
      promise: Promise.resolve().then(async () => {
        const bf = await data.arrayBuffer()
        const s = ctx.stringify(bf)
        ctx.result = ctx.result.replace(`"${id}"`, s.slice(1, s.length - 1))
      }),
    }
  },
  parse([type, bf]) {
    return new Blob([bf], { type })
  },
}

export interface FileNode {
  type: string
  name: string
  lastModified: number
  ref: string | ArrayBuffer
}

export function getFileNode(
  data: File,
  ctx: {
    stringify: (data: any) => string
    result: string
  },
): {
  node: FileNode
  promise: Promise<void>
} {
  const id = '__' + Date.now() + '__' + Math.random() + '__'
  return {
    node: {
      name: data.name,
      type: data.type,
      lastModified: data.lastModified,
      ref: id,
    },
    promise: data.arrayBuffer().then((bf) => {
      const s = ctx.stringify(bf)
      ctx.result = ctx.result.replace(`"${id}"`, s.slice(1, s.length - 1))
    }),
  }
}

export const FilePlugin: Plugin<File, FileNode> = {
  name: 'File',
  test(data) {
    return typeof File !== 'undefined' && data instanceof File
  },
  stringifyAsync(data, ctx) {
    const { node, promise } = getFileNode(data, ctx)
    return {
      value: node,
      promise,
    }
  },
  parse(data) {
    return new File([data.ref], data.name, {
      type: data.type,
      lastModified: data.lastModified,
    })
  },
}
