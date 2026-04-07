import { Plugin } from './plugin'
import { FileNode } from './blob'

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
  async stringifyAsync(data) {
    const entries = [...data.entries()]
    return Promise.all(
      entries.map(async ([k, v]) => {
        if (typeof v === 'string') {
          return [k, v] as [string, string]
        }
        if (v instanceof File) {
          return [k, {
            name: v.name,
            type: v.type,
            lastModified: v.lastModified,
            ref: await v.arrayBuffer(),
          }] as [string, FileNode]
        }
        throw new Error(`Unsupported value type: ${typeof v}`)
      }),
    )
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
