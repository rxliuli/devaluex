import { Plugin } from './plugin'
import { FileNode, getFileNode } from './blob'

export const FormDataPlugin: Plugin<FormData, [string, string | FileNode][]> = {
  name: 'FormData',
  test(data) {
    return data instanceof FormData
  },
  stringify(data) {
    return [...data.entries()].map(([k, v]) => {
      if (typeof v === 'string') {
        return [k, v]
      }
      throw new Error(`Unsupported value type: ${typeof v}`)
    })
  },
  stringifyAsync(data, ctx) {
    const entries = [...data.entries()]
    const promises: Promise<void>[] = []
    const value = entries.map(([k, v]) => {
      if (typeof v === 'string') {
        return [k, v]
      }
      if (v instanceof File) {
        const { node, promise } = getFileNode(v, ctx)
        promises.push(promise)
        return [k, node]
      }
      throw new Error(`Unsupported value type: ${typeof v}`)
    }) as [string, string | FileNode][]
    return {
      value,
      promise: Promise.all(promises) as unknown as Promise<void>,
    }
  },
  parse(data) {
    const fd = new FormData()
    data.forEach(([k, v]) => {
      if (typeof v === 'string') {
        fd.append(k, v)
        return
      }
      if (typeof v === 'object' && 'ref' in v && v.ref instanceof ArrayBuffer) {
        fd.append(
          k,
          new File([v.ref], v.name, {
            type: v.type,
            lastModified: v.lastModified,
          }),
        )
        return
      }
      throw new Error(`Unsupported value type: ${typeof v}`)
    })
    return fd
  },
}
