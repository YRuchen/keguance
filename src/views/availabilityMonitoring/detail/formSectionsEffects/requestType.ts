import type { Field } from '@formily/core'

const getEffects = () => ({
  fieldEffects: {
    // 请求类型
    'collapse.step1.protocol': {
      onFieldValueChange: (field: Field) => {
        if (!field.selfModified) {
          return
        }
        const assertionField = field.form.query('collapse.assertionsSchema.assertion')?.take() as Field
        assertionField && (assertionField.value = [{ key: '', value: '' }])
      },
    },
    // grpc检查类型
    'collapse.step1.basicActiveKey': {
      onFieldValueChange: (field: Field) => {
        if (!field.selfModified) {
          return
        }
        const assertionField = field.form.query('collapse.assertionsSchema.assertion')?.take() as Field
        assertionField && (assertionField.value = [{ key: '', value: '' }])
      },
    },
  },
})

export default getEffects
