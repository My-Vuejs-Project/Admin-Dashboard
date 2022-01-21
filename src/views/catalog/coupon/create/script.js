import Service from "../../../../utils/api/service";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  name: "CreateCoupon",
  data() {
    return {
      isUpdating: false,
      isCreating: false,
      freeShipping: true,
      body: {
        name: "",
        code: "",
        type: "percentage",
        discount: 0,
        freeShipping: true,
        categoryId: [],
        productId: [],
        minAmount: 0,
        startDate: "",
        endDate: "",
        usesTotal: 0,
        usesCustomer: 0,
        status: "active",
      },
      data: {
        productList: [],
        categories: [],
      },
      display: {
        category: false,
      },
      model: {
        products: [],
        categories: []
      },
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  components: { Multiselect, DatePicker },
  computed: {},
  created() {
    this.getCategory();
    this.getAllProducts();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListCoupon",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    getCategory() {
      Service.getAllCategories("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCategory();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.categories = response.data;
        }
      });
    },

    showCheckboxes() {
      if (this.display.category) {
        this.display.category = false;
      } else {
        this.display.category = true;
      }
    },

    getAllProducts() {
      Service.getAllProducts("").then((response) => {
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
          let productList = response.data;
          let newList = [
            {
              name: "Select All",
              list: productList,
            },
          ];

          this.data.productList = newList;
        }
      });
    },

    submitCreateCoupon() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createCoupon();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!body.name) {
        return "Name cannot be empty!";
      } else if (!body.code) {
        return "Code cannot be empty!";
      } else if (!body.type) {
        return "Type group cannot be empty!";
      } else if (!body.discount) {
        return "Discount cannot be empty!";
      } else if (!body.minAmount) {
        return "Amounts cannot be empty!";
      } else if (!body.usesTotal) {
        return "Uses per coupon cannot be empty!";
      } else if (!body.usesCustomer) {
        return "Uses per customer cannot be empty!";
      } else if (!body.startDate) {
        return "Start date/time cannot be empty!";
      } else if (!body.endDate) {
        return "End date/time cannot be empty!";
      } else if (!body.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    createCoupon() {
      this.body.productId = [];
      if (this.model.products) {
        for (let index = 0; index < this.model.products.length; index++) {
          const product = this.model.products[index];
          this.body.productId.push(product.id);
        }
      }

      this.body.categoryId = [];
      if (this.model.categories) {
        for (let index = 0; index < this.model.categories.length; index++) {
          const category = this.model.categories[index];
          this.body.productId.push(category.id);
        }
      }

      let body = {
        name: this.body.name,
        code: this.body.code,
        type: this.body.type,
        discount: this.body.discount,
        freeShipping: this.body.freeShipping,
        categoryId: this.body.categoryId,
        productId: this.body.productId,
        minAmount: this.body.minAmount,
        startDate: this.body.startDate,
        endDate: this.body.endDate,
        usesTotal: this.body.usesTotal,
        usesCustomer: this.body.usesCustomer,
        status: this.body.status,
      };

      Service.createCoupon(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createCoupon();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Coupon has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        code: "",
        type: "percentage",
        discount: 0,
        freeShipping: true,
        categoryId: [],
        productId: [],
        minAmount: 0,
        startDate: "",
        endDate: "",
        usesTotal: 0,
        usesCustomer: 0,
        status: "active",
      };
      this.model.products = [];
    },

    toUpperCase(string) {
      return string.toUpperCase();
    },

    toCapitalLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleOpenChange() {
      this.showTimePanel = false;
    },
    handleRangeClose() {
      this.showTimeRangePanel = false;
    },
  },
};
