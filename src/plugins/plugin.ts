export interface Plugin<I, O> {
  name: string
  test(data: any): boolean
  stringify?(data: I): O
  stringifyAsync?(
    data: I,
    ctx: {
      stringify: (data: any) => string
      stringifyAsync: (data: any) => Promise<string>
      parse: (data: any) => any
    },
  ): Promise<O>
  parse(
    data: O,
    ctx: {
      stringify: (data: any) => string
      parse: (data: any) => any
    },
  ): I
}
