import type { Plugin } from './plugin'

export const CryptoKeyPlugin: Plugin<CryptoKey, string> = {
  name: 'CryptoKey',
  test(data) {
    return typeof CryptoKey !== 'undefined' && data instanceof CryptoKey
  },
  stringifyAsync(data, ctx) {
    const id = '__' + Date.now() + '__' + Math.random() + '__'
    return {
      value: id,
      promise: crypto.subtle.exportKey('jwk', data).then((jwk) => {
        const algorithm: Record<string, any> = { name: data.algorithm.name }
        const alg = data.algorithm as any
        if (alg.hash) algorithm.hash = alg.hash
        if (alg.namedCurve) algorithm.namedCurve = alg.namedCurve
        if (alg.length !== undefined) algorithm.length = alg.length
        const keyData = JSON.stringify({
          jwk,
          algorithm,
          extractable: data.extractable,
          usages: [...data.usages],
        })
        ctx.result = ctx.result.replace(`"${id}"`, JSON.stringify(keyData))
      }),
    }
  },
  parse(data) {
    const { jwk, algorithm, extractable, usages } = JSON.parse(data)
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      algorithm,
      extractable,
      usages,
    ) as any
  },
}
