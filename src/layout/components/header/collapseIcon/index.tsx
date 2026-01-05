import { defineComponent, computed } from 'vue'
import { useSettingStore } from '~/store/modules/setting'
import { IconFont } from '~/KeepUp'
import styles from './index.module.scss'

export default defineComponent({
  name: "CollapseIcon",
  setup() {
    const SettingStore = useSettingStore();
    const isCollapse = computed(() => !SettingStore.isCollapse);
    const handleCollapse = () => {
      SettingStore.setCollapse(isCollapse.value);
    };
    return () => (
      <div class={styles.hamburgerContainer} onClick={handleCollapse}>
        <IconFont
          style={{
            transform: `rotate(${isCollapse.value ? "180deg" : "0"})`,
            transitionDuration: "0.1s",
            transitionProperty: "all",
          }}
          name="collapse"
        />
      </div>
    );
  },
});
