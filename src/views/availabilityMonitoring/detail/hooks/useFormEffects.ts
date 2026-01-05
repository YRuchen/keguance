import getDefineRequestEffects from '../formSectionsEffects/defineRequest'
import getRequestTypeEffects from '../formSectionsEffects/requestType'

const getEffects = () => ({
  formEffects: {},
  fieldEffects: {
    ...(getDefineRequestEffects()?.fieldEffects || {}),
    ...(getRequestTypeEffects()?.fieldEffects || {}),
  }
})

export default getEffects
