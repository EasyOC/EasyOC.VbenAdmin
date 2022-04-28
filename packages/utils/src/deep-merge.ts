import { isObject } from './is'

export const deepMerge = <T = any>(target: any = {}, src: any = {}): T => {
  let key: string
  for (key in src) {
    target[key] = isObject(target[key])
      ? deepMerge(target[key], src[key])
      : (target[key] = src[key])
  }
  return target
}
