export default {
  name: 'card-dashboard',
  components: {  
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}