import Service from "../../../../utils/api/service";

export default {
  name: "EditStockStatus",
  data() {
    return {
      isUpdating: false,
      data: {},
      customToolbar: [
        ["bold", "italic", "underline"],
        [{
          list: "ordered"
        }, {
          list: "bullet"
        }],
      ]
    };
  },
  components: {},
  computed: {},
  created() {
    this.getStockStatusDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListStockStatus",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    getStockStatusDetail(id) {
      Service.getStockStatusDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getStockStatusDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data = response.data;
        }
      });
    },

    subminUpdateStockStatus() {
      if (!this.data.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isUpdating = true;
        this.updateStockStatus();
      }
    },

    updateStockStatus() {
      let id = this.$route.query.id;
      let body = {
        name: this.data.name,
        sortOrder: this.data.sortOrder ? this.data.sortOrder : 0,
        description: this.data.description
      };

      Service.updateStockStatus(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateStockStatus();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack()
          this.$toasted.show("Stock status has been updated.");
        }
      });
    },
  },
};