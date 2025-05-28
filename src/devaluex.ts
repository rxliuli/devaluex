import * as devalue from 'devalue'
import type { Plugin } from './plugins/plugin'

export function stringify(
  data: any,
  options?: {
    plugins?: Plugin<any, any>[]
  },
) {
  const plugins = options?.plugins ?? []
  let result = devalue.stringify(
    data,
    plugins.reduce((acc, plugin) => {
      acc[plugin.name] = (data) => {
        if (!plugin.test(data)) {
          return
        }
        if (plugin.stringify) {
          return plugin.stringify(data)
        }
        if (plugin.stringifyAsync) {
          throw new Error(
            `Plugin ${plugin.name} does not support sync stringify`,
          )
        }
        throw new Error(`Plugin ${plugin.name} does not support stringify`)
      }
      return acc
    }, {} as Record<string, (data: any) => any>),
  )
  return result
}

export async function stringifyAsync(
  data: any,
  options?: {
    plugins?: Plugin<any, any>[]
  },
) {
  const plugins = options?.plugins ?? []
  const promises: Promise<void>[] = []
  let result = devalue.stringify(
    data,
    plugins.reduce((acc, plugin) => {
      acc[plugin.name] = (data) => {
        if (!plugin.test(data)) {
          return
        }
        if (plugin.stringifyAsync) {
          const r = plugin.stringifyAsync(data, {
            get result() {
              return result
            },
            set result(value) {
              result = value
            },
            stringify: (data) => stringify(data, options),
            stringifyAsync: (data) => stringifyAsync(data, options),
            parse: (data) => parse(data, options),
          })
          promises.push(r.promise)
          return r.value
        }
        if (plugin.stringify) {
          return plugin.stringify(data)
        }
        throw new Error(`Plugin ${plugin.name} does not support stringify`)
      }
      return acc
    }, {} as Record<string, (data: any) => any>),
  )
  await Promise.all(promises)
  return result
}

export function parse(
  data: string,
  options?: {
    plugins?: Plugin<any, any>[]
  },
) {
  const plugins = options?.plugins ?? []

  return devalue.parse(
    data,
    plugins.reduce((acc, plugin) => {
      acc[plugin.name] = (data) => {
        return plugin.parse(data, {
          stringify: (data) => stringify(data, options),
          parse: (data) => parse(data, options),
        })
      }
      return acc
    }, {} as Record<string, (data: any) => any>),
  )
}
