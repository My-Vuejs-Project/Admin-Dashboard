import Service from "../../../../utils/api/service";

export default {
  name: "CreateOrderStatus",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
      },
      body: {
        name: "",
        description: "",
        sortOrder: 0
      },
    };
  },
  components: {},
  computed: {},
  created() {},
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

    subminCreateOrderStatus() {
      if (!this.body.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isCreating = true;
        this.createOrderStatus()
      }
    },

    createOrderStatus() {
      let body = {
        name: this.body.name,
        sortOrder: this.body.sortOrder ? this.body.sortOrder : 0,
        description: this.body.description
      };

      Service.createOrderStatus(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createOrderStatus();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Order status has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
        sortOrder: 0
      };
    },
  },
};