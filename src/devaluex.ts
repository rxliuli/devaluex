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
  const asyncValues = new Map<any, any>()
  const promises: Promise<void>[] = []

  const ctx = {
    stringify: (data: any) => stringify(data, options),
    stringifyAsync: (data: any) => stringifyAsync(data, options),
    parse: (data: any) => parse(data, options),
  }

  const buildReducers = (collectAsync: boolean) =>
    plugins.reduce((acc, plugin) => {
      acc[plugin.name] = (data) => {
        if (!plugin.test(data)) {
          return
        }
        if (plugin.stringifyAsync) {
          if (collectAsync) {
            promises.push(
              plugin.stringifyAsync(data, ctx).then((resolved) => {
                asyncValues.set(data, resolved)
              }),
            )
            return true // dummy value, first pass result is discarded
          }
          if (asyncValues.has(data)) {
            return asyncValues.get(data)
          }
        }
        if (plugin.stringify) {
          return plugin.stringify(data)
        }
        throw new Error(`Plugin ${plugin.name} does not support stringify`)
      }
      return acc
    }, {} as Record<string, (data: any) => any>)

  // First pass: trigger all async operations
  const firstResult = devalue.stringify(data, buildReducers(true))

  if (promises.length === 0) {
    return firstResult
  }

  await Promise.all(promises)

  // Second pass: use resolved values
  return devalue.stringify(data, buildReducers(false))
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
