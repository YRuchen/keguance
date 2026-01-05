<template>
  <svg
    :class="svgClass"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
    aria-hidden="true"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <use :xlink:href="currentIconName"></use>
  </svg>
</template>

<script lang="ts">
import { computed, ref } from 'vue'

export default {
  name: 'BaseSvgIcon',
  props: {
    iconClass: { type: String, required: true },
    hoverIconClass: { type: String },
    className: { type: String },
    size: { type: Number, default: 24 },
  },
  setup(props) {
    const hovered = ref(false)
    const currentIconName = computed(() => {
      const icon = hovered.value && props.hoverIconClass
        ? props.hoverIconClass
        : props.iconClass
      return `#icon-${icon}`
    })
    const svgClass = computed(() =>
      props.className ? `svg-icon ${props.className}` : 'svg-icon'
    )
    return { hovered, currentIconName, svgClass, size: props.size }
  },
}
</script>

<style scoped lang="scss">
  .svg-icon {
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
