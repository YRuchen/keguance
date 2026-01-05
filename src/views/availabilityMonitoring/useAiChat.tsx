import { defineComponent, ref } from 'vue'
import AIChatDrawer from '~/views/ai/component/AIChatDrawer.vue'
import { CHAT_SCENE } from '~/api/domainManagement/ai/constants'

export default defineComponent({
  setup(_, { slots, expose }) {
    const drawerVisible = ref(false)

    const open = (e, rowData) => {
      e.stopPropagation()
      const filtered = Object.fromEntries(
        Object.entries({ ...rowData, domain: rowData.domainAndAddress }).filter(
          ([_, v]) => !Array.isArray(v),
        ),
      )
      delete filtered.domainAndAddress
      localStorage.setItem('metaData', JSON.stringify(filtered))
      drawerVisible.value = true
    }

    expose({ open })

    return () => (
      <>
        {slots.default?.()}
        <AIChatDrawer
          modelValue={drawerVisible.value}
          onUpdate:modelValue={(v) => (drawerVisible.value = v)}
          chatScene={CHAT_SCENE.LINE}
        />
      </>
    )
  },
})
