import { defineStore } from 'pinia'

export const useModalStore = defineStore('dialogModal', {
  state: () => ({
    isOpen: false,
    title: '',
  }),
  actions: {
    open(title = '') {
      this.isOpen = true
      this.title = title
    },
    close() {
      this.isOpen = false
      this.title = ''
    },
  },
})
