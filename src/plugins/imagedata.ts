import { Plugin } from './plugin'

export const ImageDataPlugin: Plugin<
  ImageData,
  {
    width: number
    height: number
    data: Uint8ClampedArray
    colorSpace: PredefinedColorSpace
  }
> = {
  name: 'ImageData',
  test(data) {
    return typeof ImageData === 'function' && data instanceof ImageData
  },
  stringify(data) {
    return {
      width: data.width,
      height: data.height,
      data: data.data,
      colorSpace: data.colorSpace,
    }
  },
  parse(data) {
    return new ImageData(data.data, data.width, data.height, {
      colorSpace: data.colorSpace,
    })
  },
}
