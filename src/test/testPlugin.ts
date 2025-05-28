import { it, expect } from 'vitest'
import { Plugin } from '../plugins/plugin'
import { parse, stringify, stringifyAsync } from '../devaluex'

export function testPlugin<I, O>(
  value: I,
  plugin?: Plugin<any, any> | Plugin<any, any>[],
  options: {
    name?: string
    equal?: (a: I, b: I) => boolean | Promise<boolean> | void | Promise<void>
    stringify?: typeof stringify | typeof stringifyAsync
    throw?: boolean
  } = {},
) {
  it(`should be able to stringify and parse a ${
    options.name ??
    (Array.isArray(plugin)
      ? plugin.map((p) => p.name).join(', ')
      : plugin?.name)
  }`, async () => {
    const plugins = plugin ? (Array.isArray(plugin) ? plugin : [plugin]) : []
    if (options.throw) {
      if (options.stringify === stringify) {
        expect(() => stringify(value, { plugins: plugins })).toThrowError()
        return
      }
      await expect(stringifyAsync(value, { plugins })).rejects.toThrowError()
      return
    }
    const str = await (options.stringify ?? stringifyAsync)(value, {
      plugins,
    })
    const parsed = parse(str, { plugins })
    if (options.equal) {
      const r = await options.equal(parsed, value)
      if (typeof r === 'boolean') {
        expect(r).true
      }
    } else {
      expect(parsed).toEqual(value)
    }
  })
}

export function createFormData(list: [string, string | File][]) {
  const fd = new FormData()
  list.forEach(([k, v]) => fd.append(k, v))
  return fd
}
