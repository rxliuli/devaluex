import type { Plugin } from './plugin'

export const BlobPlugin: Plugin<Blob, [string, ArrayBuffer]> = {
  name: 'Blob',
  test(data) {
    return typeof Blob !== 'undefined' && data instanceof Blob
  },
  async stringifyAsync(data) {
    return [data.type, await data.arrayBuffer()]
  },
  parse([type, bf]) {
    return new Blob([bf], { type })
  },
}

export interface FileNode {
  type: string
  name: string
  lastModified: number
  ref: ArrayBuffer
}

export const FilePlugin: Plugin<File, FileNode> = {
  name: 'File',
  test(data) {
    return typeof File !== 'undefined' && data instanceof File
  },
  async stringifyAsync(data) {
    return {
      name: data.name,
      type: data.type,
      lastModified: data.lastModified,
      ref: await data.arrayBuffer(),
    }
  },
  parse(data) {
    return new File([data.ref], data.name, {
      type: data.type,
      lastModified: data.lastModified,
    })
  },
}
