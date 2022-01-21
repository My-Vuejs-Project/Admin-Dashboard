import Service from "../../../../utils/api/service";

export default {
  name: "EditOrderStatus",
  data() {
    return {
      isUpdating: false,
      data: {},
    };
  },
  components: {},
  computed: {},
  created() {
    this.getOrderStatusDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListOrderStatus",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    getOrderStatusDetail(id) {
      Service.getOrderStatusDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOrderStatusDetail(id);
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

    subminUpdateOrderStatus() {
      if (!this.data.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isUpdating = true;
        this.updateOrderStatus();
      }
    },

    updateOrderStatus() {
      let id = this.$route.query.id;
      let body = {
        name: this.data.name,
        sortOrder: this.data.sortOrder ? this.data.sortOrder : 0,
        description: this.data.description
      };

      Service.updateOrderStatus(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateOrderStatus();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack()
          this.$toasted.show("Order status has been updated.");
        }
      });
    },
  },
};