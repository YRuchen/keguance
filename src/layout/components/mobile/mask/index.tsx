import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MobileMask',
  setup() {
    // 移动端点击
    const handleClickOutside = () => {}
    return () => (
      <div class="drawer-bg" onClick={handleClickOutside} />
    )
  }
})
