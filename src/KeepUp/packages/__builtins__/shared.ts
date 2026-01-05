/** 合并并导出 */
export const composeExpose = <
  T0 extends {}, 
  T1 extends {},
>(
  s0: T0, 
  s1: T1,
) => {
  return Object.assign(s0, s1)
}
