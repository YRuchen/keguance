import { h } from 'vue'
import { 
  createChatIdApi, 
  getChatIdListApi,
  createTokenApi,
  getTokenListApi,
} from '~/api/configManagement/notifierManagement'
import { CommonPage } from '~/KeepUp'
import { getChatIdFields, getTokenFields } from './fields'

/** tab类型 */
export enum TabType {
  /** CHAT_ID */
  CHAT_ID = 'CHAT_ID',
  /** TOKEN */
  TOKEN = 'TOKEN',
}

/** tab类型options */
export const tabTypeOptions = [
  { 
    label: 'Chat Id', 
    value: TabType.CHAT_ID, 
    getComponent: (commonPageRef) => h(
      CommonPage, 
      {
        ref: commonPageRef,
        fields: getChatIdFields(commonPageRef),
        listApi: getChatIdListApi,
        createApi: createChatIdApi,
        needPagination: true,
      },
    ),
  },
  { 
    label: 'Token', 
    value: TabType.TOKEN, 
    getComponent: (commonPageRef) => h(
      CommonPage, 
      {
        ref: commonPageRef,
        fields: getTokenFields(commonPageRef),
        listApi: getTokenListApi,
        createApi: createTokenApi,
        needPagination: true,
      },
    ),
  },
]
