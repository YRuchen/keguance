import type { Form } from '@formily/core'

/** 设置操作栏样式 */
export const setOperateBtnsStyle = (form: Form, visible: boolean) => {
  const operateBtnsField = form?.query('operateBtns')?.take()
  operateBtnsField?.setComponentProps({
    ...(operateBtnsField.componentProps || {}),
    style: {
      ...(operateBtnsField.componentProps.style || {}),
      justifyContent: visible ? 'start' : 'end',
    }
  })
}
