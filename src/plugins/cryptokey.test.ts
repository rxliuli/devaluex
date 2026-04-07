import { it, expect, describe } from 'vitest'
import { parse, stringifyAsync } from '../devaluex'
import { CryptoKeyPlugin } from './cryptokey'

async function roundTrip(key: CryptoKey) {
  const str = await stringifyAsync(key, { plugins: [CryptoKeyPlugin] })
  const parsed = await parse(str, { plugins: [CryptoKeyPlugin] })
  const [jwkA, jwkB] = await Promise.all([
    crypto.subtle.exportKey('jwk', parsed as CryptoKey),
    crypto.subtle.exportKey('jwk', key),
  ])
  expect(jwkA).toEqual(jwkB)
}

describe('CryptoKeyPlugin', () => {
  it('should serialize and deserialize an AES-GCM secret key', async () => {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    )
    await roundTrip(key)
  })

  it('should serialize and deserialize an HMAC key', async () => {
    const key = await crypto.subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      true,
      ['sign', 'verify'],
    )
    await roundTrip(key)
  })

  it('should serialize and deserialize an ECDSA key pair', async () => {
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify'],
    )
    await roundTrip(keyPair.publicKey)
    await roundTrip(keyPair.privateKey)
  })

  it('should serialize and deserialize an RSA-OAEP key pair', async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    )
    await roundTrip(keyPair.publicKey)
    await roundTrip(keyPair.privateKey)
  })

  it('should throw for non-extractable keys', async () => {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    )
    await expect(
      stringifyAsync(key, { plugins: [CryptoKeyPlugin] }),
    ).rejects.toThrowError()
  })
})
