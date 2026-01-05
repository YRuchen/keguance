import { observable } from '@formily/reactive'

import type { Field } from '@formily/core'
import type { IFetchConfig } from '~/interfaces/commonPage'
import type { IFieldEffect } from '~/basicComponents/formilyCmps/formilyForm'

const keyword = observable.ref('')
const useAsyncDataSource = ({ api, params = {}, remote, formatter }: IFetchConfig): IFieldEffect => {
  const commonFetch = async (field: Field) => {
    field.loading = true
    try {
      const res = await api?.({
        ...(
          keyword.value 
            ? { keyword: keyword.value } 
            : {}
        ),
        ...(typeof params === 'function' ? await params?.() : params),
      })
      const result = formatter?.(res) || res
      field.setDataSource(result)
    } catch (error: any) {
      console.error(`远程搜索失败，失败原因：${error}`)
    } finally {
      field.loading = false
    }
  }
  return {
    onFieldInit: async (field: Field) => {
      if (remote) {
        field.setComponentProps({ remoteMethod: (val: string) => { keyword.value = val }  })
      } else {
        await commonFetch(field)
      }
    },
    ...(
      remote
        ? {
          onFieldReact: async (field: Field) => {
            await commonFetch(field)
          }
        }
        : {}
    ),
  } as unknown as IFieldEffect
}

export default useAsyncDataSource
