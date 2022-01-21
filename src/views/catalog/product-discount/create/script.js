import Service from "../../../../utils/api/service";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import Multiselect from "vue-multiselect";
export default {
  name: "CreateProductDiscount",
  data() {
    return {
      isCreating: false,
      body: {
        refId: "",
        type: "product",
        customerGroupId: "",
        minQuantity: 0,
        priority: 0,
        price: 0,
        status: "active",
        startDate: "",
        endDate: "",
      },
      data: {
        productListStored: [],
        productList: [],
        customerGroups: [],
      },
      showTimePanel: false,
      showTimeRangePanel: false,
      model: {
        startDate: {
          date: "",
          time: "",
        },
        endDate: {
          date: "",
          time: "",
        },
        product: "",
      },
    };
  },
  components: { DatePicker ,Multiselect},
  computed: {},

  mounted() { },

  created() {
    this.getAllProducts();
    this.getCustomerGroups();
  },

  methods: {
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
          this.data.productList = response.data;
          this.data.productListStored = response.data;
        }
      });
    },

    getCustomerGroups() {
      Service.getCustomerGroups("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomerGroups();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.customerGroups = response.data;
        }
      });
    },

    showMore() {
      this.data.pagination.limit += 10;
      this.getData(this.data.pagination.limit);
    },

    goBack() {
      this.$router.push({
        name: "ListProductDiscount",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    submitCreateDiscount() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createDiscount();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!this.model.product.id) {
        return "Product cannot be empty!";
      } else if (!body.type) {
        return "Type cannot be empty!";
      } else if (!body.customerGroupId) {
        return "Customer group cannot be empty!";
      } else if (!body.minQuantity) {
        return "Mininum quantity cannot be empty!";
      } else if (!body.price) {
        return "Price cannot be empty!";
      } else if (!body.priority) {
        return "Priority cannot be empty!";
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

    createDiscount() {
      let body = {
        refId: this.model.product.id,
        type: this.body.type,
        customerGroupId: this.body.customerGroupId,
        minQuantity: this.body.minQuantity,
        priority: this.body.priority,
        price: this.body.price,
        status: this.body.status,
        startDate: this.body.startDate,
        endDate: this.body.endDate,
      };
      Service.createProductDiscount(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createDiscount();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Product discount has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        refId: "",
        type: "product",
        customerGroupId: "",
        minQuantity: 0,
        priority: 0,
        price: 0,
        status: "active",
        startDate: "",
        endDate: "",
      };
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
  }
};
