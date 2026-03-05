import { expect, it } from 'vitest'
import { testPlugin } from '../test/testPlugin'
import { ImageDataPlugin } from './imagedata'

const supportsColorSpace = 'colorSpace' in new ImageData(1, 1)

const data = [255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255]
testPlugin(
  new ImageData(new Uint8ClampedArray(data), 2, 2, {
    colorSpace: 'srgb',
  }),
  [ImageDataPlugin],
  {
    name: 'ImageData',
    equal: (a) => {
      expect(a.width).eq(2)
      expect(a.height).eq(2)
      expect(a.data).toEqual(new Uint8ClampedArray(data))
      if (supportsColorSpace) {
        expect(a.colorSpace).eq('srgb')
      }
    },
  },
)
testPlugin(
  new ImageData(new Uint8ClampedArray(2 * 2 * 4), 2, 2, {
    colorSpace: 'srgb',
  }),
  [ImageDataPlugin],
  {
    name: 'ImageData with colorSpace',
    equal: (a) => {
      expect(a.width).eq(2)
      expect(a.height).eq(2)
      expect(a.data).toEqual(
        new Uint8ClampedArray(Array.from({ length: 16 }, () => 0)),
      )
      if (supportsColorSpace) {
        expect(a.colorSpace).eq('srgb')
      }
    },
  },
)
