/**
 * @author Kirito
 * @date 2025-07-30 10:41
 */
import { ref, unref } from 'vue'

import type { Ref } from 'vue'

/**
 * 将ArrayItems类型值，转为Object类型
 * @param target [
 *  { key: 'keyVal', value: 'valueVal' },
 *  { key: 'keyVal1', value: 'valueVal1' },
 * ]
 * @returns {
 *  keyVal: 'valueVal',
 *  keyVal1: 'valueVal1',
 * }
 * @author Kirito
 */
export const arrayItemsToObject = (target: Record<string, any>[] = []): Record<string, any> => {
  return Object.fromEntries(target.map(v => ([v.key, v.value])))
}

/** 将Object类型值，转为ArrayItems类型 */
export const objectToArrayItems = (target: Record<string, any> = {}): Record<string, any>[] => {
  return Object.entries(target).map(([k, v]) => ({ key: k, value: v })) as unknown as Record<string, any>[]
}

/** 将任何值转为ref */
export const toReactiveRef = <T>(val: T | Ref<T>) => {
  return ref(unref(val))
}
