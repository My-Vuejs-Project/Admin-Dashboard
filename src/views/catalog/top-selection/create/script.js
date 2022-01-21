import Service from "../../../../utils/api/service";
import Multiselect from "vue-multiselect";

export default {
  name: "CreateTopSelection",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
      },
      data: {
        productList: []
      },
      body: {
        product: {},
        productId: "",
        sortOrder: "",
      },
    };
  },
  components: { Multiselect },
  
  created() {
    this.getAllProducts();
  },

  watch: {
    "$route.fullPath": function() {
      this.getAllProducts();
    },
  },

  methods: {
    goBack() {
      this.$router.push({
        name: "ListTopSelection",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    async getAllProducts() {
      let param = "?status=active";

      await Service.getAllProducts(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllProducts();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.productList = response.data;
        }
      });
    },

    subminCreateTopSelection() {
      if (!this.body.product) {
        this.$toasted.show("Product cannot be empty!");
      } else if (!this.body.sortOrder) {
        this.$toasted.show("Sort order cannot be empty!");
      } else {
        this.isCreating = true;
        this.createTopSelection();
      }
    },

    createTopSelection() {
      let body = {
        productId: this.body.product.id,
        sortOrder: this.body.sortOrder,
      };

      Service.createTopSelection(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createTopSelection();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Top selection product has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        product: {},
        productId: "",
        sortOrder: "",
      };
    },
  },
};
