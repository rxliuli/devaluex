import type { Plugin } from './plugin'

interface CryptoKeyData {
  jwk: JsonWebKey
  algorithm: Record<string, any>
  extractable: boolean
  usages: KeyUsage[]
}

export const CryptoKeyPlugin: Plugin<CryptoKey, CryptoKeyData> = {
  name: 'CryptoKey',
  test(data) {
    return typeof CryptoKey !== 'undefined' && data instanceof CryptoKey
  },
  async stringifyAsync(data) {
    const jwk = await crypto.subtle.exportKey('jwk', data)
    const algorithm: Record<string, any> = { name: data.algorithm.name }
    const alg = data.algorithm as any
    if (alg.hash) algorithm.hash = alg.hash
    if (alg.namedCurve) algorithm.namedCurve = alg.namedCurve
    if (alg.length !== undefined) algorithm.length = alg.length
    return {
      jwk,
      algorithm,
      extractable: data.extractable,
      usages: [...data.usages],
    }
  },
  parse(data) {
    return crypto.subtle.importKey(
      'jwk',
      data.jwk,
      data.algorithm as AlgorithmIdentifier,
      data.extractable,
      data.usages,
    ) as any
  },
}
