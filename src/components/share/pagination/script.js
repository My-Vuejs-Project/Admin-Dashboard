export default {
  name: 'pagination',
  props: {
    pagination: Number,
    method: {
      type: Function
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      inputPage: null,
    }
  },

  components: {

  },
  created() {
    this.setPageAndLimit()
  },
  watch: {
    '$route.fullPath': function () {
      this.setPageAndLimit()
    }
  },
  computed: {
    paging: function (total) {
      if (total > 10) {
        return Math.ceil(total / 10)
      }
      return 1
    }
  },
  methods: {
    setPageAndLimit() {
      var queryPage = this.$root.$route.query.page
      var queryLimit = this.$root.$route.query.limit
      if (queryPage != undefined) this.page = queryPage
      if (queryLimit != undefined) this.limit = queryLimit
    },

    BackPage(type) {
      this.select.menu = type;
      if (this.pagination.page == 1) {
        this.pagination.page = this.pagination;
      } else {
        this.pagination.page--;
      }

      if (this.$route.query.id) {
        this.$router.push({
          path: this.$route.path,
          query: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            id: this.pagination.id
          }
        });
        this.method(this.pagination.page, this.pagination.id);
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            page: this.pagination.page,
            limit: this.pagination.limit
          }
        });
        this.method(this.pagination.page);
      }
    },

    goTo(page) {
      if (page != 0) {
        if (this.page <= this.pagination) {
          console.log(page);
          if (page >= 1 && page <= this.pagination) {
            this.page = page
          }
        }
        else {
          this.page = 1
        }
        this.$root.$router.push({
          query: Object.assign({}, this.$route.query, {
            page: this.page
          })
        }) 
      }
    }

  }
}